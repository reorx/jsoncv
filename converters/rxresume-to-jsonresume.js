const Ajv = require('ajv')
const ajvAddFormats = require("ajv-formats")
const dayjs = require('dayjs')
const fs = require('fs')
const objectPath = require('object-path')
const path = require('path')

// defines which property in source json (value) to map to which property in JSONResume json (key).
// the first level keys of conversionMap are the same keys in JSONResume.
const conversionMap = {
  basics: {
    name: 'name',
    email: 'email',
    phone: 'phone',
    url: 'website',
    // need to merge 'headline' in 'summary'
    summary: 'summary',
    image: 'photo.url',
    location: {
      key: 'location',
      conversion: {
        address: 'address',
        postalCode: 'postalCode',
        city: 'city',
        countryCode: 'country',
        region: 'region',
      }
    },
  },
  education: {
    "institution": 'institution',
    "url": 'url',
    "area": 'area',
    "studyType": 'degree',
    "startDate": 'date.start',
    "endDate": 'date.end',
    "score": 'score',
    "courses": 'courses',
    /* droped properties: summary */
  },
  work: {
    /* missing properties: location, description, highlights */
    name: 'name',
    position: 'position',
    url: 'url',
    // need to reformat to YYYY-MM-DD
    startDate: 'date.start',
    endDate: 'date.end',
    summary: 'summary',
  },
  skills: {
    "name": 'name',
    // need to merge 'levelNum' in 'level'
    "level": 'level',
    "keywords": 'keywords',
  },
  projects: {
    /* missing properties: roles, entity, type */
    "name": 'name',
    "description": 'description',
    "keywords": 'keywords',
    "startDate": 'date.start',
    "endDate": 'date.end',
    "url": 'url',
    // need to convert 'summary' to 'highlights'
  },
  // sideProjects is grabed from custom section with name "open-source" or "side-projects"
  languages: {
    "language": 'name',
    // need to merge 'levelNum' in 'fluency'
    "fluency": 'level',
  },
  references: {
    "name": 'name',
    // need to merge 'relationship', 'phone', 'email' in 'reference'
    "reference": 'summary',
  },
  awards: {
      "title": 'title',
      "date": 'date',
      "awarder": 'awarder',
      // need to merge 'url' in 'summary'
      "summary": 'summary',
  },
  publications: {
    "name": 'name',
    "publisher": 'publisher',
    "releaseDate": 'date',
    "url": 'url',
    "summary": 'summary',
  },
  interests: {
    "name": 'name',
    "keywords": 'keywords',
  },
  volunteer: {
    /* missing properties: highlights */
    "organization": 'organization',
    "position": 'position',
    "url": 'url',
    "startDate": 'date.start',
    "endDate": 'date.end',
    "summary": 'summary',
  },

  // custom section
  sideProjects: {
    'name': 'title',
    'url': 'url',
    'description': 'summary',
    'keywords': 'keywords',
    "startDate": 'date.start',
    "endDate": 'date.end',
  }
}

// convert function
function convert(source) {
  const result = {}

  // basics
  result.basics = convertObject(source.basics, conversionMap.basics, (item, result) => {
    if (item.headline) {
      result.summary = `${item.headline}\n${result.summary || ''}`
    }
  })

  // basics.profiles
  if (source.basics.profiles) {
    result.basics.profiles = source.basics.profiles.map(profile => {
      const newProfile = {...profile}
      delete newProfile.id
      return newProfile
    })
  }

  /* sections */

  const sections = source.sections || {}

  const sectionToResult = (sectionKey, itemCustomFunc, resultKey) => {
    const section = sections[sectionKey]
    if (!section) return
    if (!section.items || section.items.length === 0) return

    if (!resultKey) resultKey = sectionKey
    result[resultKey] = section.items.map(item => convertObject(item, conversionMap[resultKey], itemCustomFunc))
  }

  // education
  sectionToResult('education', (item, result) => {
    if (item.summary) {
      console.log(`warn: summary is dropped in education item: institution=${item.institution} summary=${item.summary}`)
    }
    formatDatesInResult(result)
  })

  // work
  sectionToResult('work', (item, result) => {
    formatDatesInResult(result)
  })

  // skills
  sectionToResult('skills', (item, result) => {
    if (item.levelNum) {
      if (result.level) {
        result.level = `${result.level}, ${item.levelNum}`
      } else {
        result.level = `${item.levelNum}`
      }
    }
  })

  // projects
  sectionToResult('projects', (item, result) => {
    if (item.summary) {
      result.highlights = item.summary.split('\n')
    }
    formatDatesInResult(result)
  })

  // languages
  sectionToResult('languages', (item, result) => {
    if (item.levelNum) {
      if (result.fluency) {
        result.fluency = `${result.fluency}, ${item.levelNum}`
      } else {
        result.fluency = `${item.levelNum}`
      }
    }
  })

  // references
  sectionToResult('references', (item, result) => {
    const lines = []
    if (item.relationship)
      lines.push(`relationship: ${item.relationship}`)
    if (item.phone)
      lines.push(`phone: ${item.phone}`)
    if (item.email)
      lines.push(`email: ${item.email}`)
    if (lines.length > 0)
      result.reference = lines.join('\n') + '\n\n' + result.reference
  })

  // awards
  sectionToResult('awards', (item, result) => {
    if (item.url) {
      result.summary = `${item.url}\n\n${result.summary}`
    }
  })

  // publications
  sectionToResult('publications')

  // interests
  sectionToResult('interests')

  // volunteer
  sectionToResult('volunteer', (item, result) => {
    formatDatesInResult(result)
  })

  /* custom sections */
  const sideProjectsSectionNames = ['side-projects', 'open-source']
  for (const section of Object.values(sections)) {
    if (section.type !== 'custom') continue

    const sectionName = section.name.toLowerCase()
    if (!sideProjectsSectionNames.includes(sectionName)) continue

    result.sideProjects = section.items.map(item => convertObject(item, conversionMap.sideProjects, (item, result) => {
      formatDatesInResult(result)
    }))
    break
  }

  return result
}

function convertObject(obj, objMap, customFunc) {
  // console.log(`convert ${JSON.stringify(obj)} by ${objMap}`)
  const result = {}
  for (const [key, conversion] of Object.entries(objMap)) {

    if (typeof conversion === 'string') {
      const value = objectPath.get(obj, conversion)
      if (value === undefined || value === "") continue

      result[key] = value
    } else if (typeof conversion === 'object') {
      const value = objectPath.get(obj, conversion.key)
      if (!value) continue

      result[key] = convertObject(value, conversion.conversion)
    }
  }
  if (customFunc)
    customFunc(obj, result)
  return result
}

const dateKeys = ['startDate', 'endDate']

function formatDatesInResult(result) {
  for (const key of dateKeys) {
    const dateStr = result[key]
    if (!dateStr) continue
    result[key] = dayjs(dateStr).format('YYYY-MM-DD')
  }
}


/* main */

// read json from file, which is the first argument
const sourceJSON = fs.readFileSync(process.argv[2], 'utf8')

// parse json
const source = JSON.parse(sourceJSON)

const result = convert(source)
// console.log(`result: ${JSON.stringify(result, null, 2)}`)

// validate result with jsoncv schema
const ajv = new Ajv()
ajvAddFormats(ajv)
const schemaPath = path.resolve(__dirname, '..', 'schema/jsoncv.schema.json')
const schema = JSON.parse(fs.readFileSync(schemaPath))
const valid = ajv.validate(schema, result)
if (valid) {
  console.log('Validation succeeded.')
} else {
  console.log('Validation failed:', ajv.errors)
}

// write to target file
const targetPath = process.argv[3]
console.log(`write to ${targetPath}`)
fs.writeFileSync(targetPath, JSON.stringify(result, null, 2))

# jsoncv

A toolkit to construct your CV/Resume using JSON and produce stylish HTML/PDF documents.

jsoncv comprises the following components:
1. Schema
2. CV
3. Editor

For in-depth explanations and usage guidelines, please refer to the documentation below.


## Introduction

### Schema

jsoncv use [JSON Schema](https://json-schema.org/) to create JSON-based standard for CVs.

The schema used in jsoncv is a fork of the [JSON Resume Schema](https://jsonresume.org/schema/),
with the following differences:

- JSON Schema version

    JSON Resume utilizes the outdated draft-04 version, while jsoncv uses the current draft-07. To ensure compatibility with draft-07, all instances of `additionalItems` have been removed.
- Additional "sideProjects" section

    jsoncv includes an additional section, called "sideProjects", that allows for the distinction between side projects and career projects
- Additional "name" property in "meta" section

    jsoncv includes a "name" property in the "meta" section, which allows the user to specify the desired name for exported HTML/PDF files. If the "name" property is not specified, a combination of "basics.name" and "meta.version" will be used instead.

These differences do not impact the compatibility between jsoncv and JSON Resume. This means that you can easily import JSON Resume data into jsoncv and vice versa, as jsoncv data will pass the validation of JSON Resume Schema .

The complete diff between the JSON Resume schema and the jsoncv schema can be viewed [here](https://github.com/reorx/jsoncv/compare/eabd65fd5a9a126e2de9e2955485c0dca4483c79...master#diff-3b8e847cb1664e291a7635b037a2f2bf831e1e9ce2d915fbfbba9ca77e2a1d1b)

### CV



### Editor

## Usage


### Write your CV

### Export CV data and HTML

### Convert HTML to PDF

### Build static CV site

### Create your own theme


## FAQ

### Text copied from the PDF is reversed

Chrome "Save as PDF" produces documents with backwards text when copying

["Save as PDF" produces documents with backwards text. - Google Chrome Community](https://support.google.com/chrome/thread/29061484/save-as-pdf-produces-documents-with-backwards-text?hl=en&dark=0)

Solutions:

1. Use Firefox
2. Use CLI tools like [WeasyPrint](https://github.com/Kozea/WeasyPrint)

## TODO

## Credits

I would like to extend our sincere thanks to all of the projects listed below, as this project would not have been possible without their invaluable contributions.

- [JSON Resume](https://jsonresume.org/)
- [json-editor](https://github.com/json-editor/json-editor)
- [iconify](https://iconify.design/)

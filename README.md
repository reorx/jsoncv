# jsoncv

A toolkit to construct your Curriculum Vitae/Résumé using JSON and produce stylish HTML/PDF documents.

jsoncv comprises the following components:
1. Schema
2. Editor
3. CV HTML
4. Converters

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

### Editor

jsoncv comes with an online editor that provides a graphical user interface for creating and editing your jsoncv data.
Visit it at https://jsoncv.reorx.com/editor/.

The Editor consists of three columns, from left to right:

1. Sidebar

    Allows navigation to different sections in the schema form and provides operations such as "Download HTML" and "Upload Data"
2. Schema Form

    Lets you edit the properties of your CV data. You can also select which properties to display or hide.
3. Preview

    Displays the rendered CV HTML as changes are made in the Schema Form.


### CV HTML

The core product of jsoncv is CV HTML, which is the HTML representation of your jsoncv data.
It is a compact, single-file HTML document that can be converted to PDF or hosted online to create a static CV website.

CV HTML is designed with a specific layout to display a CV on an A4 sheet of paper.
The CSS has been tailored to optimize printing, ensuring the best output whether printed on paper or saved as a PDF.
Therefore, CV HTML is best suited for creating professional or academic CVs/resumes,
rather than creative or interactive portfolio websites.

CV HTMl supports themes, which can be found in the `src/themes` directory.

### Converters

## Usage


### Write your CV

### Export CV data and HTML

### Convert HTML to PDF

### Build a static CV site

### Create your own theme

## Tech stack

- vite
- ejs
- scss
- iconify
- ajv

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

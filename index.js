// `fs` is a native dependency in nodejs
const fs = require('fs')
// `path` is a native dependency in nodejs
const path = require('path')
// `katex` is a dependency that is installed by running
// `npm i` in the project folder in the terminal
const katex = require('katex')

// here we set the path to the input file
const inputFilePath = path.join(__dirname, 'input.html')
// here we set the path for the output file
const outputFilePath = path.join(__dirname, 'output.html')

const renderMath = function ({ input, output } = {}) {
  // we read the original file
  const original = fs.readFileSync(input, 'utf8')
  // we split the original file by `$$` to get the parts that
  // are formulas and the parts that are not formulas
  const modified = original
    .split('$$')
    .map((str, ix) => {
      // the even strings are the normal HTML parts
      // which we don't need to render with Katex
      if (ix % 2 === 0) {
        return str
      }

      try {
        // here we do the Katex rendering
        return katex.renderToString(str, {
          // This is an example of some macros that Elio used.
          // It helps Katex resolve custom macros. If you do not
          // have any macros then line 28 can just be this:
          // return katex.renderToString(str)
          // macros: {
          //   '\\iu': '\\mathrm{i}',
          //   '\\eul': '\\mathrm{e}',
          //   '\\dif': '\\mathrm{d}',
          //   '\\cis': '\\operatorname{cis}',
          // },
        })
      } catch (err) {
        // In case Katex had an error we color that part red
        // and add the error message as an HTML comment
        return `<!-- ${err} --> <span style='background-color: red; color:white; font-weight: bold;'>${str}</span>`
      }
    })
    .join('')
  fs.writeFileSync(output, modified, 'utf8')
}

// here we call the function that will do the rendering
renderMath({
  input: inputFilePath,
  output: outputFilePath,
})

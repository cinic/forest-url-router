declare module '*.css' {
  const content: {[className: string]: string}
  export default content
}

declare module '*.png' {
  const content: string
  export default content
}

interface Process {
  env: {
    [k: string]: string
  }
}

declare const process: Process

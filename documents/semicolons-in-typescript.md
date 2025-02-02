---
title: "Are you using semicolons in JS/TS? Maybe is time to remove them"
date: 2024-08-25
cover: pexels-karolina-grabowska-4021799.jpg
url: /no-more-js-semicolons
tags:
  - javascript
  - typescript
  - opinion
---

I have been using [standardjs](https://standardjs.com/) (and [standardts](https://github.com/standard/ts-standard)) for 5 years as _lint_ ruleset in my projects, and I am very happy with that. I tried before [Google config lint](https://github.com/google/eslint-config-google) and [eslint-config-airbnb
](https://github.com/airbnb/javascript) and one of the main differences I found between those rulesets is relative to semicolons; Google and Airbnb require the use of semicolons at the of the lines, but _standardjs_ don't.

I worked a long time ago with PHP that requires them, but I adapted very fast to not use them in JavaScript and Go. Now I'm working on a project with a ruleset that includes the semicolons rule, and I found it a little bit uncomfortable in some situations

I guess this is a discussion like [tabs vs spaces](https://www.youtube.com/watch?v=SsoOG6ZeyUI) but I want to share my thoughts and give you references to opinions in the community about it.

## Background

Before entering subjective (opinions) things let's talk about if JavaScript need semicolons and about the ASI (Automatic semicolon insertion)

### ASI

JS (ECMAScript) allows us to not terminate statements and declarations with a semicolons, as the interpreter will "insert" a semicolon automatically, for example "when the _offending token_ that is not allowed by any production of the grammar is separated from the previous token by at least one line (LineTerminator)",

Simplifying, that means that if the next token has no meaning for the previous one, the interpreter adds an automatic semicolon. For example

```ts
myFunction() // an automatic semicolon will be inserted here as otherFunction() has no meaning for myFunction()
otherFunction()

myFunction() // No semicolon will be inserted here as `.value` is valid in for the language grammar (accessing to the myFunction() result property
.value

myFunction() // No semicolon will be inserted here as `[` is valid in for the language grammar
[1,2,3].forEach(...)
```

The last example is interesting as the interpreter doesn't add the automatic semicolon, but will throw a syntax error as the token `,` is not correct there (we will swe how to solve it later)

(You can check the full list at https://tc39.es/ecma262/#sec-automatic-semicolon-insertion)

> Note that the TC39 specification says "Most ECMAScript statements and declarations must be terminated with a semicolon. Such semicolons may always appear explicitly in the source text. For convenience, however, such semicolons may be omitted from the source text in certain situations. These situations are described by saying that semicolons are automatically inserted into the source code token stream in those situations."

## Community opinions

As with tabs vs spaces topic, there are multiple points of view and opinions in the community let's review them

### In favor of not using

In the [_standardjs_ rules' list page](https://standardjs.com/rules#semicolons) they provide multiple links about the motivation to don't use them. They also provide an extra rule to avoid the issues with the tokens like `[`, `(` and <code>`</code>

I recommend you to read the [Open letter to Javascript leaders regarding semicolons](https://blog.izs.me/2010/12/an-open-letter-to-javascript-leaders-regarding/) by [Isaac Z. Schlueter](https://x.com/izs?lang=es).

His voice is very relevant in the community as he is the creator of NPM, and in the letter (written 14 years ago), he explains:

> "Yes, it’s quite safe, and perfectly valid JS that every browser understands. Closure compiler, yuicompressor, packer, and jsmin all can properly minify it. There is no performance impact anywhere." -- Isaac Z. Schlueter

### Against of not using

- The most important voice is the TC39 specification, which indicates "statements and declarations must be terminated with a semicolon.", we can still fulfill this requirement without writing semicolons, please continue reading my thoughts to see how
- Some cases like when the next line starts with `[`, `(` and <code>`</code> need it (but it can be solved with a lint rule like the one _standardjs_ provides) or when you try to use return in 2 lines can be not obvious you are doing it wrong without semicolons. https://medium.com/free-code-camp/codebyte-why-are-explicit-semicolons-important-in-javascript-49550bea0b82
- The use of semicolons is a widely-accepted practice in the JavaScript community and you will find a lot of code following this

## My thoughts

Probably this is the less important part of this post, but I want to share it with you in any case

### Semicolons represents a visual overload

I believe semicolons add noise to the code and are not really needed (except in a couple of cases), for example, when you use an anonymous array you need to explicitly say the interpreter the `[` doesn't try to access the previous line result:

```ts
someFunction();
[1, 2].forEach((x) => console.log(x));
```

### Manual editions

When you are editing a multiline sentence and need to add a new line you need to manually remove the semicolon. Check this example:

```ts
["z", "d", "C", 1, 9, "a"].filter((char) => !isNaN(char));
```

Now you want to map the result to uppercase, adding an extra line, intuitively you add a new line after the last one.

```ts
  ['z', 'd', 'C', 1, 9, 'a']
    .filter(char => !isNaN(char));
    .map(char => char.toLocaleUpperCase())
```

This will fail as the semicolon in the second line breaks the code, you must remove it and add it in the last line.

This is something _prettier_ or the `lint --fix` can not handle like in a coma-separated list and you need to take care of it.

### Semicolons are mandatory

As the TC39 specification mentions "statements and declarations must be terminated with a semicolon.", but probably you are not writing code that will be passed to the interpreter directly, probably you are using Typescript and or a bundler, or a minifier. All of those will add the implicit semicolons for you.

Check yourself, open the [Typescript playground](https://www.typescriptlang.org/play) and you can check the example code don't include the semicolons, but the transpiled one does.

![TS playground](img_1.png)

## Conclusion

I think there are good arguments in both positions, and I guess the most conventional and extended position is to use semicolons in JS, but in TS seems very extended to don't use them. I think both positions are valid, but maybe you can spend a few minutes to think about that and what do you prefer.

I feel very comfortable not using them, but in any case I have not big issues working with or without semicolons, it's not a blocking or an annoying thing.

I don´t want to create a flame, flames are unuseful, just to know the different opinions.

What do you use and/or prefer? Please let me know in the comments

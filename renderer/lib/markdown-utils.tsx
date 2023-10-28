import { Fragment } from 'react'
import Markdown from 'react-markdown'

import remarkGfm from 'remark-gfm'
import rehypeSanitize from 'rehype-sanitize'
import rehypeFormat from 'rehype-format'
import rehypeRaw from 'rehype-raw'



class MarkDownUtils {
    isMarkdown(text: string): boolean {
        if (!text) { return false }

        const checkes = [
            null !== text.match(/^# /),    // h1
            null !== text.match(/^## /),    // h2
            null !== text.match(/^### /),    // h3
            null !== text.match(/^#### /),    // h4
            null !== text.match(/^##### /),    // h5
            null !== text.match(/^###### /),    // h6
            null !== text.match(/^- /),    // ul
            null !== text.match(/^\* /),    // ul
            null !== text.match(/^\d\. /),    // ol
            null !== text.match(/^> /),    // blockquote
            null !== text.match(/^```/),    // codeblock
            null !== text.match(/^\[.*\]\(.*\)/),    // link
            null !== text.match(/^!\[.*\]\(.*\)/),    // image
            null !== text.match(/^---/),    // hr
            null !== text.match(/\*{1,3}[^*]+\*{1,3}/),    // strong
            null !== text.match(/__[^_]+__/),    // underline
            null !== text.match(/\~\~[^\~]+\~\~/),    // strike
            null !== text.match(/\n{2}/),    // br
            null !== text.match(/`[^`]*`/),    // inline code
        ]

        // 2個以上マッチしたらMarkdownと判定する
        const match = checkes.filter(value => value).length
        console.log('MarkDownUtils: isMarkdown: match: ', match)
        return 2 <= match
    }



    /*
    removeExtraHtmlBreaks(text: string): string {
        if (!text) { return '' }
        return text.replace(/(<br\s*\/?>\s*\n\s*){2,}/g, '<br />\n')
    }

    removeHtmlLink(text: string): string {
        if (!text) { return '' }
        // aタグの開きタグと閉じタグだけを消し、子要素は残す
        return text.replace(/<\/?a[^>]*>/g, '')
    }

    removeHtmlImage(text: string, replaceAlt: boolean): string {
        if (!text) { return '' }

        if (replaceAlt) {
            return text.replace(/<\/?img[^>]*>/g, (match) => {
                const alt = match.match(/alt="([^"]+)"/)
                if (alt) { return alt[1] }
                return ''
            })
        }

        // imgタグの開きタグと閉じタグだけを消し、子要素は残す
        return text.replace(/<\/?img[^>]*>/g, '')
    }

    stripTags(text: string): string {
        if (!text) { return '' }
        text = text.replace(/<\/?[^>]+>/g, '')
        // text = text.replace(/^[\u0020\u3000\u202f\u205f\s\r\n]+$/g, '\n')
        text = text.replace(/^[\u0009\u000A\u000B\u000C\u000D\u0020\u0085\u00A0\u1680\u180E\u2000-\u200A\u202F\u205F\u3000\s\t\r\n]+|[\u0009\u000A\u000B\u000C\u000D\u0020\u0085\u00A0\u1680\u180E\u2000-\u200A\u202F\u205F\u3000\s\t\r\n]+$/g, '\n');
        return text
    }
    */



    convertMarkDown2ReactComponent(texts: string) {
        if (!texts) { return '' }

        if (this.isMarkdown(texts)) {
            /*
            console.log('MarkDownUtils: convertMarkDown2ReactComponent: texts.length: ', texts.length)
            console.log('MarkDownUtils: convertMarkDown2ReactComponent: texts: ', texts)

            const output =
                this.removeExtraHtmlBreaks(
                    this.stripTags(
                        this.removeHtmlImage(texts, true)
                    )
                )

            console.log('MarkDownUtils: convertMarkDown2ReactComponent: output.length: ', output.length)
            console.log('MarkDownUtils: convertMarkDown2ReactComponent: output: ', output)
            */

            const logPlugin = (name) => 
                () =>
                    (tree) => {
                        //console.log('MarkDownUtils: convertMarkDown2ReactComponent: logPlugin: ', name, ': ', tree)
                    }

            return (
                <Markdown
                    remarkPlugins={[
                        remarkGfm,
                        logPlugin('remarkGfm'),
                    ]}
                    rehypePlugins={[
                        rehypeRaw,
                        logPlugin('rehypeRaw'),
                    ]}
                    /*
                    rehypePlugins={[
                        rehypeRaw,
                        logPlugin('rehypeRaw'),
                        rehypeSanitize,
                        logPlugin('rehypeSanitize'),
                        rehypeFormat,
                        logPlugin('rehypeFormat'),
                    ]}
                    */
                >{texts}</Markdown>
            )
        }

        const textList = texts.split('\n').map((text, index) => {
            return (
                <Fragment key={index}>
                    {text}<br />
                </Fragment>
            )
        })

        return (
            <>{textList}</>
        )
    }
}



const md = new MarkDownUtils()
export default md



import CommonMark from 'commonmark';


const mdParser = new CommonMark.Parser({ smart: true });
const mdWriter = new CommonMark.HtmlRenderer({ safe: true });


const parseMarkdown = (source) => (
  { __html: mdWriter.render(mdParser.parse(source)) }
);

export default parseMarkdown;

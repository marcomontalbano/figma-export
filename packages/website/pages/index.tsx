import Title from '../src/Title'
import GitHubLink from '../src/GitHubLink'
import OutputComponents from '../src/output-components'
import OutputStyles from '../src/output-styles'
import ReadyToStart from '../src/ReadyToStart'
import { GetStaticProps } from 'next'
import { resolve } from 'path/posix'

type Props = {
    icons: string;
    monochromeIcons: string;
}

export default function HomePage({ icons, monochromeIcons }: Props) {
    return (
        <>
            <div className="svgstore" dangerouslySetInnerHTML={{ __html: icons }} />
            <div className="svgstore" dangerouslySetInnerHTML={{ __html: monochromeIcons }} />

            <Title />
            <GitHubLink />

            <OutputComponents />
            <OutputStyles />

            <ReadyToStart />
        </>
    );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
    const fs = require('fs');
    const path = require('path');
    const outputFolder = path.resolve(process.cwd(), 'output')

    return {
        props: {
            icons: fs.readFileSync(path.resolve(outputFolder, 'svgstore', 'icons.svg'), 'utf8'),
            monochromeIcons: fs.readFileSync(path.resolve(outputFolder, 'svgstore-monochrome', 'icons.svg'), 'utf8')
        },
    }
}

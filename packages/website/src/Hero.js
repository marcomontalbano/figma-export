/* eslint-disable import/no-unresolved */
import { h } from 'preact';

import * as Octicons from '../output/es6-datauri-octicons/Octicons';
import { figmaArrow } from '../output/es6-datauri/icons';

import figmaImage from '../images/figma-octicons.png';

const Hero = () => (
    <div className="octicons">
        <div className="figma-screen">
            <img src={figmaImage} />
            {/* <div className="copyright"><a target="_blank" rel="noopener noreferrer" href="https://github.com/primer/octicons">A scalable set of icons handcrafted with <span>❤️</span> by GitHub</a></div> */}
        </div>
        <div className="figma-export">
            <div className="figma-gradient text title">
                run<br />
                figma-export<br />
                <img alt="figma arrow" className="figma-arrow" src={figmaArrow} />
            </div>
        </div>
        <div className="icons">
            { Object.values(Octicons).reverse().map(octicon => (<img className="icon" src={octicon} />)) }
        </div>
    </div>
);

export default Hero;

// formkit.config.js
// import { createProPlugin, inputs as proInputs } from '@formkit/pro'
import { generateClasses } from '@formkit/themes';
import GenesisTheme from "@/css/genesis";
import { plugin as inertiaPlugin } from "formkit-addon-inertia"

export default {
    icons: {
        /*
        ...genesisIcons,
        checkboxDecorator: genesisIcons.check,
        fileItem: genesisIcons.fileDoc,
        fileRemove: genesisIcons.close,
        select: iconLoader('ri:arrow-down-s-line'),
        close: iconLoader('ri:close-line'),
        remove: iconLoader('ri:close-line'),
        removeItem: iconLoader('ri:close-line'),
        noFiles: genesisIcons.fileDoc,
        radioDecorator: genesisIcons.circle,
        */
    },
    config: {
        classes: generateClasses(GenesisTheme),
    },
    inputs: {
        //
    },
    plugins: [
        inertiaPlugin,
        // createProPlugin('fk-74298dac2fd', proInputs),
    ],
}

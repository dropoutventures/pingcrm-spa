import { createProPlugin, inputs as proInputs } from '@formkit/pro'
import { createInput } from '@formkit/vue';
import { generateClasses } from '@formkit/themes';
import GenesisTheme from "@/css/genesis";
import { plugin as inertiaPlugin } from "formkit-addon-inertia"

// Custom Inputs
import Captcha from "@/components/Captcha.vue";
import OTP from "@/components/OTP.vue";

function iconLoader (iconName) {
    return fetch(`https://api.iconify.design/${iconName}.svg`)
        .then(async (r) => {
            const icon = await r.text()
            if (icon.startsWith('<svg')) {
                return icon
            }
            return undefined
        }).catch((e) => {
            console.error(e)
            return undefined
        })
}

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
    iconLoader: iconLoader,
    config: {
        classes: generateClasses(GenesisTheme),
    },
    inputs: {
        captcha: createInput(Captcha, {
            props: ['puzzle', 'piece', 'y'],
        }),
        otp: createInput(OTP, {
            props: ['digits'],
            family: 'text',
        }),
    },
    plugins: [
        inertiaPlugin,
        createProPlugin('fk-74298dac2fd', proInputs),
    ],
}

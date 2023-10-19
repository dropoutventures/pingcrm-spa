import { reactive } from 'vue'

export const store = reactive({
    csrfToken: undefined,
    pushRegistered: false
});
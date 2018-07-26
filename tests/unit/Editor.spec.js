import Vue from 'vue'
import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'

import Editor from '@/components/Editor.vue'

describe('Editor.vue', () => {
    const wrapper = shallowMount(Editor);

    it('renders the correct markup', () => {
        expect(wrapper.html()).contain('<main class="default">')
    })

})

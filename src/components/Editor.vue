<template>
<main v-bind:class="themes[currentTheme]">
    <div class="panel sx">
        <textarea :value="input" @input="update" v-focus></textarea>
    </div>
    <div class="panel dx" id="presentation"
        v-bind:class="{ full: fullscreen }">
        <div id="slides" v-bind:class="{ present: present }">
            <div class="slide"
                v-bind:class="{ current: slide.pk === current }"
                v-for="slide in slides"
                v-bind:key="slide.pk"
                v-html="slide.htmlValue">
            </div>
        </div>
    </div>
    <div v-if="info" id="info">
        <h2>Keys definitions</h2>
        <dl>
            <dt>spacebar</dt>
            <dd>show/hide editor</dd>
            <dt>arrow keys</dt>
            <dd>next/previous slide</dd>
            <dt>h</dt>
            <dd>show/hide this help</dd>
            <dt>t</dt>
            <dd>cycle through themes</dd>
            <dt>p</dt>
            <dd>toggle between expose/presentation mode</dd>
        </dl>
        <button class="info__gotit" @click="info = false">Got it</button>
    </div>
</main>
</template>

<script>
import _ from 'lodash';
import marked from 'marked';
import DefaultText from '@/DefaultPresentation.js';

const DEFAULT_MARKED_OPTIONS = {
    gfm: true,
    sanitize: true,
    headerIds: false,
    tables: true,
};

export default {
    name: 'Editor',
    data() {
        return {
            input: DefaultText.text,
            slides: [],
            current: 0,
            fullscreen: false,
            themes: ['default', 'white', 'solarized-dark', 'solarized-light'],
            currentTheme: 0,
            present: false,
            info: false,
        }
    },
    mounted() {
        window.addEventListener('keyup', this.handleKey);
    },
    computed: {
        getCurrentSlideIndex() {
            if (this.slides.length === 0) {
                return 0;
            } else {
                return this.current + 1;
            }
        },
    },
    methods: {
        update: _.debounce(function(e) {
            this.input = e.target.value;
            this.getSlides();
        }, 400),
        getSlides() {
            let res = marked(this.input, DEFAULT_MARKED_OPTIONS);
            res = _.drop(res.split('<h1>'));
            res = res.map((x, i) => {
                return {
                    pk: i,
                    htmlValue: `<h1>${x}`,
                }
            });
            this.slides = res;
        },
        handleKey(e) {
            if (e.target !== document.body) return;
            switch(e.which) {
                case 39:
                case 40:
                    this.move(e, 'next');
                break;
                case 37:
                case 38:
                    this.move(e, 'prev');
                break;
                case 32:
                    this.fullscreen = !this.fullscreen;
                break;
                case 84:
                    this.nextTheme();
                break;
                case 80:
                    this.present = !this.present;
                break;
                case 72:
                    this.info = !this.info;
                break;
            }
        },
        move(e, direction='next') {
            if (this.slides.length < 2) return;
            if (direction === 'next') {
                this.current += this.current === this.slides.length - 1 ? 0 : 1;
            } else {
                this.current -= this.current === 0 ? 0 : 1;
            }
        },
        nextTheme() {
            if (this.currentTheme === this.themes.length - 1)
                this.currentTheme = 0
            else
                this.currentTheme += 1;
        },
        presentMode() {
        },
    },
    directives: {
        focus: {
            bind(el, _, vnode) {
                vnode.context.input = el.value;
                vnode.context.getSlides();
            },
            inserted(el) {
                el.focus();
            }
        }
    }
}
</script>

<style src="./Editor.css"></style>

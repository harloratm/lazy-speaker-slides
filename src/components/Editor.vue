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

<style lang="css">
main {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.panel {
    position: absolute;
    height: 100%;
    top: 0;
}

.panel.sx {
    left: 0;
    width: 30%;
}

.panel.dx {
    left: 30%;
    width: 70%;
    z-index: 2;
    transition: left .15s ease-out, width .15s ease-out;
    overflow-y: auto;
}
    .panel.dx.full {
        left: 0;
        width: 100%;
    }

.slide {
    margin: 20px;
    padding: 20px;
    line-height: 1.5;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
    .slide > * + * {
        margin-top: 15px;
    }

#info {
    z-index: 999;
    position: fixed;
    width: 80%;
    height: 80%;
    top: 10%;
    left: 10%;
    background-color: rgba(0, 0, 0, .9);
    display: flex;
    border-radius: 8px;
    color: white;
    flex-wrap: wrap;
    flex-direction: column;
    justify-content: center;
    padding: 40px;
}

#info dl {
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
}

#info dt {
    font-size: 20px;
    padding: 6px;
    background: #202020;
    border-radius: 4px;
    flex: 0 0 150px;
    margin-bottom: 4px;
}

#info dd {
    font-size: 18px;
    flex: 0 0 calc(100% - 150px);
    padding: 0 10px;
}

.info__gotit {
    padding: 10px 18px 6px 18px;
    cursor: pointer;
    border: 0;
    font-size: 18px;
    background-color: yellow;
    color: black;
    position: absolute;
    bottom: 10px;
    right: 10px;
    border-radius: 4px;
}

#slides.present {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
}
    #slides.present .slide {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        margin: 0;
        border: 0;
        transform: translateX(100%);
        transition: transform .2s ease;
        padding-left: 15%;
        padding-right: 15%;
    }
    #slides.present .slide.current {
        transform: translateX(0);
    }




/* THEMES */

main.default #presentation {
    background-color: black;
    color: white;
}
main.default textarea {
    background-color: #222;
    color: #ccc;
}
    main.default textarea:focus {
        outline: 2px solid yellow;
    }
main.default .slide {
    border: 2px solid #333;
}
    main.default .slide.current {
        border: 2px dashed yellow;
    }
main.default a,
main.default a:visited {
    color: yellow;
}
main.default a:hover {
    color: white;
}
main.default code,
main.default pre {
    color: yellow;
    background-color: #202020;
}


main.white #presentation {
    background-color: white;
    color: #333;
}
main.white textarea {
    background-color: #eee;
    color: #333;
}
    main.white textarea:focus {
        outline: 2px solid blue;
    }
main.white .slide {
    border: 2px solid #eee;
}
    main.white .slide.current {
        border-color: blue;
    }
main.white a,
main.white a:visited {
    color: blue;
}
main.white a:hover {
    color: black;
}
main.white code,
main.white pre {
    color: blue;
    background-color: #eee;
}


main.solarized-dark #presentation {
    background-color: #002b36;
    color: #eee8d5;
}
main.solarized-dark textarea {
    background-color: #073642;
    color: #93a1a1;
}
    main.solarized-dark textarea:focus {
        outline: 2px solid #d33682;
    }
main.solarized-dark .slide {
    border: 2px dashed #586e75;
}
    main.solarized-dark .slide.current {
        border: 2px solid #d33682;
    }
main.solarized-dark a,
main.solarized-dark a:visited {
    color: #d33682;
}
main.solarized-dark a:hover {
    color: #d33682;
}
main.solarized-dark code,
main.solarized-dark pre {
    background-color: #073642;
    color: #d33682;
}



main.solarized-light #presentation {
    background-color: #fdf6e3;
    color: #586e75;
}
main.solarized-light textarea {
    background-color: #eee8d5;
    color: #586e75;
}
    main.solarized-light textarea:focus {
        outline: 2px solid #d33682;
    }
main.solarized-light .slide {
    border: 2px dashed #93a1a1;
}
    main.solarized-light .slide.current {
        border: 2px solid #d33682;
    }
main.solarized-light a,
main.solarized-light a:visited {
    color: #d33682;
}
main.solarized-light a:hover {
    color: #d33682;
}
main.solarized-light code,
main.solarized-light pre {
    background-color: #073642;
    color: #fdf6e3;
}
</style>

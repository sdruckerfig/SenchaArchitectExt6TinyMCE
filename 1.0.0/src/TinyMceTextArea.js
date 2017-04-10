/*jshint bitwise:true, curly:true, eqeqeq:true, forin:true, noarg:true, noempty:true, nonew:true, undef:true, browser:true */
/*global Ext, tinymce, tinyMCE */

/*-------------------------------------------------------------------
 Ext.ux.form.TinyMCETextArea

 ExtJS form field - a text area with integrated TinyMCE WYSIWYG Editor

 Version: 5.1
 Release date: 27.09.2014
 ExtJS Version: 5.0.0
 TinyMCE Version: 4.1.5
 License: LGPL v3 or later, Sencha License

 Author: Oleg Schildt
 E-Mail: Oleg.Schildt@gmail.com

 Copyright (c) 2014 Oleg Schildt

 Following issues are covered:

 - Initialization in an initially visible and in an initially invisible tab.
 - Correct place occupation by the initialization in any ExtJS layout.
 - Correct resizing by the resizing of the underlying text area.
 - Activation and deactivation of the WYSIWYG editor.
 - Enabling and disabling of the WYSIWYG editor control.
 - ReadOnly state support.
 - Changing of WYSIWYG settings and CSS file for the editable contents on the fly.
 - Pre-formatting of the HTML text in visible and invisible modus.
 - Focusing of the WYSIWYG editor control.
 - Marking invalid.
 - Tracking dirty state.
 - Storing and restoring cursor position by inserting of a place holder over a popup window.


 Modified Apr 8, 2017 for Sencha Architect 4.x compatibility
 By Steve Drucker (sdrucker@figleaf.com)

 Known issues:
 - Issues with dynamic height resizing

 -------------------------------------------------------------------*/

Ext.define('Ext.ux.form.TinyMceTextArea', {

    extend: 'Ext.form.field.TextArea',
    alias: 'widget.tinymce',

    //-----------------------------------------------------------------

    apiKey: '', // tinymce API Key

    /*
     Flag for tracking the initialization state
     */
    wysiwygIntialized: false,
    intializationInProgress: false,
    loadingLibrary: false,

    lastHeight: null,
    lastFrameHeight: null,

    /*
     This properties enables starting without WYSIWYG editor.
     The user can activate it later if he wants.
     */
    noWysiwyg: false,

    tinyMCEConfig: {},

   

    /*
      tinymce 4.x plugins
    */

    plugin_advlist: false,
    plugin_anchor: false,
    plugin_autolink: false,
    plugin_autoresize: false,
    plugin_autosave: false,
    plugin_bbcode: false,
    plugin_charmap: false,
    plugin_code: true,
    plugin_advcode: false,
    plugin_compat3x: false,
    plugin_contextmenu: false,
    plugin_directionality: false,
    plugin_emoticons: false,
    plugin_fullpage: false,
    plugin_fullscreen: false,
    plugin_hr: false,
    plugin_image: false,
    plugin_insertdatetime: false,
    plugin_legacyoutput: false,
    plugin_link: false,
    plugin_lists: false,
    plugin_importcss: false,
    plugin_media: false,
    plugin_nonbreaking: false,
    plugin_noneditable: false,
    plugin_pagebreak: false,
    plugin_paste: true,
    plugin_preview: false,
    plugin_print: false,
    plugin_save: false,
    plugin_searchreplace: false,
    plugin_spellchecker: false,
    plugin_table: false,
    plugin_textcolor: false,
    plugin_visualblocks: true,
    plugin_visualchars: false,
    plugin_tinymcespellchecker: false,
    plugin_wordcount: false,

    /* future use
    plugin_ice: true,
    plugin_icesearchreplace: false,
    */

    hideToolbarsOnBlur: true,
    statusbar: false,
    showFormattingToolbar: true,
    showEditorMenu: false,
    showCustomMenu: false,
    browserSpellCheck: false,
    smallButtonIcons: false,
    combineToolbars: false,
    font_formats: 'Arial Unicode MS,Arial,helvetica,sans-serif;',


    formattingToolbar: "undo redo | bold italic underline strikethrough superscript subscript | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat",

    validateOnChange: true,
    spellchecker_language: 'en',
    spellchecker_whitelistUrl: '',

    toolbar: [], // configurable toolbar
    image_list: [], // allowed images for insertion


    cssUrls: '',

    // ice specific
    iceUserName: 'anonymous',
    iceUserId: 0,


    /*
     Config object for the TinyMCE configuration options
     */
    /*
    tinyMCEConfig: {
        plugins: [
            // "advlist autolink lists link image charmap print preview hr anchor pagebreak code",
            // "media nonbreaking save table contextmenu directionality"
            "searchreplace wordcount visualblocks visualchars paste fullscreen insertdatetime paste link contextmenu"

            // "emoticons template textcolor",

        ],

        // toolbar1: "newdocument fullpage | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | styleselect formatselect fontselect fontsizeselect",
        // toolbar2: "cut copy paste | searchreplace | bullist numlist | outdent indent blockquote | undo redo | link unlink anchor image media code | inserttime preview | forecolor backcolor",
        // toolbar3: "table | hr removeformat | subscript superscript | charmap emoticons | print fullscreen | ltr rtl | spellchecker | visualchars visualblocks nonbreaking template pagebreak restoredraft",
        // content_css: "contents.css",

        toolbar1: "insertdatetime | undo redo | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | cut copy paste | link unlink | fullscreen",

        menubar: false,
        toolbar_items_size: 'medium'
    },
    */

    /*
     In the ExtJS 5.x, the liquid layout is used if possible. 
     The liquid layout means that the component is rendered
     with the help of pure CSS without any JavaScript. In this 
     case, no sizing events are fired.
     
     However, the event 'resize' is essential for the 
     Ext.ux.form.TinyMCETextArea. For that reason, we set 
     liquidLayout to false.
     */
    liquidLayout: false,

    //-----------------------------------------------------------------
    afterRender: function() {
        var me = this;

        me.callParent(arguments);

        me.on('blur', function(elm, ev, eOpts) {

            var ctrl = document.getElementById(me.getInputId());

            if (me.wysiwygIntialized) {
                var ed = tinymce.get(me.getInputId());

                // In the HTML text modus, the contents should be
                // synchronized upon the blur event.
                if (ed && ed.isHidden()) {
                    if (ctrl) {
                        me.positionBeforeBlur = {
                            start: ctrl.selectionStart,
                            end: ctrl.selectionEnd
                        };
                    }

                    ed.load();
                }
            } else {
                if (ctrl) {
                    me.positionBeforeBlur = {
                        start: ctrl.selectionStart,
                        end: ctrl.selectionEnd
                    };
                }
            }
        }, me);

        me.on('resize', function(elm, width, height, oldWidth, oldHeight, eOpts) {

            if (!me.noWysiwyg && !me.wysiwygIntialized) {
                me.initEditor(height);
            } else {
                me.syncEditorHeight(height);
            }
        }, me);
    },
    //-----------------------------------------------------------------
    syncEditorHeight: function(height) {
        var me = this;

        me.lastHeight = height;

        if (!window.tinymce || !me.wysiwygIntialized || !me.rendered) {
            return;
        }

        var ed = tinymce.get(me.getInputId());

        // if the editor is hidden, we do not syncronize
        // because the size values of the hidden editor
        // are calculated wrong.

        if (ed.isHidden()) {
            return;
        }

        var edIframe = Ext.get(me.getInputId() + "_ifr");

        var parent = edIframe.up(".mce-edit-area");
        parent = parent.up(".mce-container-body");

        var newHeight = height;

        if (me.labelAlign == 'top') {
            var labelEl = this.getEl().select(".x-form-item-label-top").elements[0];
            newHeight -= labelEl.offsetHeight;
        }

        var edToolbar = parent.down(".mce-toolbar-grp");
        if (edToolbar)
            newHeight -= edToolbar.getHeight();

        var edMenubar = parent.down(".mce-menubar");
        if (edMenubar)
            newHeight -= edMenubar.getHeight();

        var edStatusbar = parent.down(".mce-statusbar");
        if (edStatusbar)
            newHeight -= edStatusbar.getHeight();

        me.lastFrameHeight = newHeight - 3;

        edIframe.setHeight(newHeight - 3);

        return newHeight - 3;
    },
    //-----------------------------------------------------------------
    showBorder: function(state) {
        var me = this;

        var elm = Ext.getDom(me.getId() + "-inputWrap");
        if (!elm) return;

        if (state) elm.classList.remove("tinymce-hide-border");
        else elm.classList.add("tinymce-hide-border");

        var elm = Ext.getDom(me.getId() + "-triggerWrap");
        if (!elm) return;

        if (state) elm.classList.remove("tinymce-hide-border");
        else elm.classList.add("tinymce-hide-border");
    },
    //-----------------------------------------------------------------
    initEditor: function(height) {

        var me = this;

        // load library if not available
        if (!window.tinymce && !me.loadingLibrary) {
            me.loadingLibrary = true;
            Ext.Loader.loadScript({
                url: this.libraryUrl + '?apiKey=' + this.apiKey,
                onLoad: function() {
                    me.initEditor(height);
                },
                scope: window
            });
            return;
        }

        if (me.noWysiwyg || me.intializationInProgress || me.wysiwygIntialized) {
            return;
        }

        me.intializationInProgress = true;

        // use small buttons?
        if (me.smallButtonIcons) {
            var cmpId = this.getId();
            var styleOverrides = ''.concat(
                '#' + cmpId + ' .mce-toolbar .mce-ico {',
                'font-size: 12px !important;',
                'line-height: 12px !important;',
                'width: 12px !important;',
                'height: 12px !important;',
                '}',

                '#' + cmpId + ' .mce-flow-layout-item {',
                'margin:0px !important;',
                '}',

                '#' + cmpId + ' .mce-btn button {',
                'padding: 2px 4px 0px 4px !important;',
                'line-height: inherit !important',
                '}'

            );
            Ext.util.CSS.createStyleSheet(styleOverrides, "tinymceoverrides_" + this.getId());
        }

        if (!me.tinyMCEConfig || Ext.Object.isEmpty(me.tinyMCEConfig)) {

            me.tinyMCEConfig = {};

            // added more helper configs by sdd
            var plugins = [];
            for (var i in me) {
                if (i.indexOf('plugin_') == 0) {
                    if (me[i])
                        plugins.push(i.substring(7));
                }
            }

            // support directionality rtl/ltr
            if (Ext.Array.contains(plugins, "directionality")) {
                if (me.showFormattingToolbar) {
                    me.formattingToolbar += " | ltr rtl ";
                } else {
                    me.toolbar.push("ltr");
                    me.toolbar.push("rtl");
                }

            }

            // emoticon support
            if (Ext.Array.contains(plugins, "emoticons")) {
                me.toolbar.push("emoticons");
            }

            if (Ext.Array.contains(plugins, "fullpage")) {
                me.toolbar.push("fullpage");
            }

            if (Ext.Array.contains(plugins, "fullscreen")) {
                if (!Ext.Array.contains(me.toolbar, "fullscreen")) {
                    me.toolbar.push("fullscreen");
                }
            }

            if (Ext.Array.contains(plugins, "insertdatetime")) {
                me.toolbar.push("insertdatetime");
            }

            if (Ext.Array.contains(plugins, "nonbreaking")) {
                me.toolbar.push("nonbreaking");
                Ext.applyIf(me.tinyMCEConfig, {
                    nonbreaking_force_tab: true
                });
            }

            if (Ext.Array.contains(plugins, "noneditable")) {
                Ext.applyIf(me.tinyMCEConfig, {
                    nonbreaking_leave_contenteditable: true
                });
            }

            if (Ext.Array.contains(plugins, "pagebreak")) {
                Ext.applyIf(me.tinyMCEConfig, {
                    pagebreak_separator: "<br style='page-break-after:always'>"
                });
            }

            if (Ext.Array.contains(plugins, "paste")) {

                Ext.apply(me.tinyMCEConfig, {
                    paste_as_text: true,
                    paste_word_valid_elements: "ul,li,p",
                    extended_valid_elements: "p[*],span[*],insert[*],delete[*]",
                    paste_preprocess: function(plugin, args) {
                        // args.target.bloomLanguage
                        // args.content
                        //  debugger;
                        if (args.target.bloomLanguage) {
                            args.content = args.content.replace(new RegExp(escapeRegExp('<p>'), 'g'), '<p class="lang-' + args.target.bloomLanguage + '" lang="' + args.target.bloomLanguage + '">');
                        }
                    }
                });
            }

            if (Ext.Array.contains(plugins, "preview")) {
                me.toolbar.push("preview");
            }

            if (Ext.Array.contains(plugins, "print")) {
                me.toolbar.push("print");
            }

            if (Ext.Array.contains(plugins, "save")) {
                me.toolbar.push("save");
            }

            if (Ext.Array.contains(plugins, "searchreplace")) {
                me.toolbar.push("searchreplace");
            }

            if (Ext.Array.contains(plugins, "table")) {
                Ext.applyIf(me.tinyMCEConfig, {
                    tools: "inserttable"
                });
            }

            if (Ext.Array.contains(plugins, "textcolor")) {
                me.toolbar.push("forecolor backcolor");
            }

            if (Ext.Array.contains(plugins, "visualchars")) {
                me.toolbar.push("visualchars");
            }

            if (Ext.Array.contains(plugins, "visualblocks")) {
                // me.toolbar.push("visualblocks");
                me.formattingToolbar += " visualblocks ";
            }

            if (Ext.Array.contains(plugins, "wordcount")) {
                me.statusbar = true;
            }

            if (Ext.Array.contains(plugins, "charmap")) {
                me.toolbar.push("charmap");
            }

            if (Ext.Array.contains(plugins, "code") || Ext.Array.contains(plugins, "advcode")) {
                me.toolbar.push("code");
            }

            // 
            // various spell checkers
            //

            // extended spellchecker
            if (Ext.Array.contains(plugins, "tinymcespellchecker")) {
                me.formattingToolbar += " | spellchecker ";
                me.tinyMCEConfig.spellchecker_language = me.spellchecker_language;
            }

            // standard spellchecker
            if (Ext.Array.contains(plugins, "spellchecker") && !Ext.Array.contains(plugins, "tinymcespellchecker")) {
                me.formattingToolbar += " | spellchecker ";
            }

            // use built in, browser-based spell checking
            Ext.applyIf(me.tinyMCEConfig, {
                browser_spellcheck: me.browserSpellCheck
            });

            // 
            // Toolbars and Menus
            //


            if (Ext.Array.contains(plugins, "contextmenu")) {
                me.tinyMCEConfig.contextmenu_never_use_native = true;
            }

            // toolbars 
            if (me.showFormattingToolbar) {
                Ext.apply(me.tinyMCEConfig, {
                    toolbar1: me.formattingToolbar
                });
            }

            if (me.toolbar.length > 0) {
                if (me.showFormattingToolbar) {
                    if (!me.combineToolbars) {
                        Ext.applyIf(me.tinyMCEConfig, {
                            toolbar2: me.toolbar.join(' ')
                        });
                    } else {
                        me.formattingToolbar += " | " + me.toolbar.join(' ');
                        Ext.apply(me.tinyMCEConfig, {
                            toolbar1: me.formattingToolbar
                        });
                    }
                } else {
                    Ext.applyIf(me.tinyMCEConfig, {
                        toolbar1: me.toolbar.join(' ')
                    });
                }
            }


            // editor menu
            if (me.showEditorMenu) {
                Ext.applyIf(me.tinyMCEConfig, {
                    menubar: true
                });
            } else {
                Ext.applyIf(me.tinyMCEConfig, {
                    menubar: false
                });
            }

            if (me.showCustomMenu) {
                Ext.applyIf(me.tinyMCEConfig, {
                    menubar: true,
                    menu: me.editorMenu
                });
            }

            if (me.cssUrls) {
                Ext.applyIf(me.tinyMCEConfig, {
                    content_css: me.cssUrls
                });
            }


            Ext.apply(me.tinyMCEConfig, {
                image_list: me.image_list,
                plugins: plugins.join(' '),
                font_formats: me.font_formats,
                statusbar: me.statusbar,
                inline: me.inline,
                extClass: this
            });

        } else {
            // We need clone, not reference.
            // The configuration of the wysiwyg might be passed as an object to
            // many editor instances. Through cloning, we prevent
            // side effects on other editors upon internal modifications
            // of the tinyMCEConfig
            var tmp_cfg = me.tinyMCEConfig;
            me.tinyMCEConfig = {};
            Ext.Object.merge(me.tinyMCEConfig, tmp_cfg);
        }

        Ext.apply(me.tinyMCEConfig, {
            mode: "exact",
            resize: false,
            elements: me.getInputId()
        });


        if (me.lastFrameHeight) {
            me.tinyMCEConfig.height = me.lastFrameHeight;
        } else {
            me.tinyMCEConfig.height = 30;
        }

        if (me.readOnly || me.isDisabled()) {
            me.tinyMCEConfig.readonly = true;
        }


        // This provides that the editor get focus 
        // by click on the label

        if (me.labelEl) {
            me.labelEl.on('click', function(ev, elm, opts) {
                me.focus(false);
            }, me.labelEl);
        }

        // We have to override the setup method of the TinyMCE.
        // If the user has define own one, we shall not loose it.
        // Store it and call it after our specific actions.
        var user_setup = null;

        if (me.tinyMCEConfig.setup) {
            user_setup = me.tinyMCEConfig.setup;
        }

        // BEGIN: setup
        me.tinyMCEConfig.setup = function(ed) {

            ed.on('init', function(e) {
                me.wysiwygIntialized = true;
                me.intializationInProgress = false;

                me.showBorder(false);

                // This piece of code solves the problem of change propagation so that
                // there is no need to call triggerSave

                var setContent = ed.setContent;
                ed.setContent = function() {
                    setContent.apply(ed, arguments);
                    ed.fire('change', {});
                };

                if (height) {
                    // setTimeout is a hack. The problem is that the editor
                    // it not realle ready, when init fires.
                    setTimeout(function() {
                        me.syncEditorHeight(height);
                    }, 200);
                }
            });

            // Catch and propagate the change event 
            if (me.bind && me.bind.value && !me.bind.single) {
                var ev = 'blur';
            } else {
                var ev = 'change';
            }

            ed.on(ev, function(e) {
                var oldval = me.getValue();
                var newval = ed.getContent();

                ed.save();

                me.fireEvent('change', me, newval, oldval, {});
                me.checkDirty();

                if (me.validateOnChange) {
                    me.validate();
                }
            });

          

            // This ensures that the focusing the editor
            // bring the parent window to front

            ed.on('focus', function(e) {
                var w = me.findParentByType('window');
                if (w) w.toFront(true);
            });

            if (user_setup) {
                user_setup(ed);
            }

        };
        // END: setup


        tinymce.init(me.tinyMCEConfig);

        me.intializationInProgress = false;
        me.wysiwygIntialized = true;
    },
    //-----------------------------------------------------------------
    getEditor: function() {
        var me = this;
    },
    //-----------------------------------------------------------------
    isEditorHidden: function() {
        var me = this;

        if (!me.wysiwygIntialized) {
            return true;
        }

        var ed = tinymce.get(me.getInputId());
        if (!ed) {
            return true;
        }

        return ed.isHidden();
    },
    //-----------------------------------------------------------------
    showEditor: function() {
        var me = this;

        me.storedCursorPosition = null;

        if (!me.wysiwygIntialized) {
            me.noWysiwyg = false;
            me.initEditor(me.getHeight());
            return;
        }

        var ed = tinymce.get(me.getInputId());
        if (!ed) {
            return;
        }

        ed.show();

        me.showBorder(false);

        ed.nodeChanged();

        if (me.lastHeight) {
            me.syncEditorHeight(me.lastHeight);
        }

        me.focus();
    },
    //-----------------------------------------------------------------
    hideEditor: function() {
        var me = this;

        if (!me.wysiwygIntialized) {
            return;
        }

        var ed = tinymce.get(me.getInputId());
        if (!ed) {
            return;
        }

        var node = ed.selection.getNode();

        if (!node || node.nodeName === "#document" || node.nodeName === "BODY" || node.nodeName === "body") {
            ed.hide();
            me.showBorder(true);

            return;
        }

        // otherwise try to position the cursor

        var marker = '<a id="_____sys__11223___"></a>';
        ed.selection.collapse(true);
        ed.execCommand('mceInsertContent', 0, marker);

        ed.hide();
        me.showBorder(true);

        var ctrl = document.getElementById(me.getInputId());

        var pos = -1;
        var txt = "";

        if (ctrl) {
            txt = ctrl.value;
            pos = txt.indexOf(marker);
        }

        if (pos !== -1) {
            var re = new RegExp(marker, "g");
            txt = txt.replace(re, "");
            ctrl.value = txt;

            if (ctrl.setSelectionRange) {
                ctrl.focus();
                ctrl.setSelectionRange(pos, pos);
            }
        }
    },
    //-----------------------------------------------------------------
    toggleEditor: function() {
        var me = this;

        if (!me.wysiwygIntialized) {
            me.showEditor();
            return;
        }

        var ed = tinymce.get(me.getInputId());

        if (ed.isHidden()) {
            me.showEditor();
        } else {
            me.hideEditor();
        }
    },
    //-----------------------------------------------------------------
    removeEditor: function() {
        var me = this;

        if (me.intializationInProgress) {
            return me;
        }

        if (!me.wysiwygIntialized) {
            return me;
        }

        var ed = tinymce.get(me.getInputId());
        if (ed) {
            ed.save();
            ed.destroy(false);

            var edIframe = Ext.get(me.getInputId() + "_ifr");
            if (edIframe) edIframe.destroy();

            me.showBorder(true);
        }

        me.wysiwygIntialized = false;

        return me;
    }, //removeEditor
    //-----------------------------------------------------------------
    // Sometimes, the editor should be reinitilized on the fly, e.g.
    // if the body css has been changed (in a CMS the user changed
    // the design template of a page opened in the editor).
    // This method removes the editor from the textarea, adds the
    // changed properties to the base config object and initializes
    // the editor again.
    //-----------------------------------------------------------------
    reinitEditor: function(cfg) {
        var me = this;

        if (me.noWysiwyg || me.intializationInProgress) {
            return me;
        }

        if (!me.tinyMCEConfig) {
            me.tinyMCEConfig = {};
        }
        if (!cfg) {
            cfg = {};
        }


        Ext.apply(me.tinyMCEConfig, cfg);

        if (!me.wysiwygIntialized) {
            return me;
        }

        var hidden = true;

        var ed = tinymce.get(me.getInputId());
        if (ed) {
            hidden = ed.isHidden();
            ed.save();

            var edIframe = Ext.get(me.getInputId() + "_ifr");
            if (edIframe) edIframe.destroy();

            ed.destroy(false);
        }

        me.wysiwygIntialized = false;

        if (!hidden) {
            me.initEditor(me.getHeight());
        }

        return me;
    },
    //-----------------------------------------------------------------
    setValue: function(v) {
        var me = this;

        var res = me.callParent(arguments);

        if (me.wysiwygIntialized) {
            // The editor does some preformatting of the HTML text
            // entered by the user.
            // The method setValue sets the value of the textarea.
            // We have to load the text into editor for the
            // preformatting and then to save it back to the textarea.

            var ed = tinymce.get(me.getInputId());
            if (ed) {
                ed.load();
                ed.save();
            }
        }

        return res;
    },
    //-----------------------------------------------------------------
    focus: function(selectText, delay) {
        var me = this;

        if (me.isDisabled()) {
            return me;
        }

        if (delay) {
            if (isNaN(delay)) {
                delay = 10;
            }

            setTimeout(function() {
                me.focus.call(me, selectText, false);
            }, delay);
            return me;
        }

        if (!me.wysiwygIntialized) {
            return me.callParent(arguments);
        }

        var ed = tinymce.get(me.getInputId());

        if (ed && !ed.isHidden()) {
            me.callParent(arguments);

            ed.focus();
        } else {
            return me.callParent(arguments);
        }

        return me;
    },
    //-----------------------------------------------------------------
    enable: function(silent) {
        var me = this;
        var result = me.callParent(arguments);

        if (!result) {
            return result;
        }

        if (me.tinyMCEConfig.readonly) {
            me.reinitEditor({
                readonly: false
            });
        }

        return result;
    },
    //-----------------------------------------------------------------
    disable: function(silent) {
        var me = this;
        var result = me.callParent(arguments);

        if (!result) {
            return result;
        }

        if (!me.tinyMCEConfig.readonly) {
            me.reinitEditor({
                readonly: true
            });
        }

        return result;
    },
    //-----------------------------------------------------------------
    setReadOnly: function(readOnly) {
        var me = this;

        var result = me.callParent(arguments);

        if (readOnly !== me.tinyMCEConfig.readonly) {
            me.reinitEditor({
                readonly: readOnly
            });
        }

        return result;
    }, // setReadOnly
    //-----------------------------------------------------------------
    storeCurrentSelection: function() {
        var me = this;

        var wwg_mode = false;

        var ed = tinymce.get(me.getInputId());

        if (me.wysiwygIntialized) {
            if (ed && !ed.isHidden()) {
                wwg_mode = true;
            }
        }

        var ctrl = document.getElementById(me.getInputId());

        if (wwg_mode) {
            me.storedCursorPosition = ed.selection.getBookmark('simple');
        } else if (ctrl) {
            me.storedCursorPosition = me.positionBeforeBlur;
        }
    }, // storeCurrentSelection
    //-----------------------------------------------------------------
    restoreCurrentSelection: function() {
        var me = this;

        if (!me.storedCursorPosition) {
            return;
        }

        var wwg_mode = false;

        var ed = tinymce.get(me.getInputId());

        if (me.wysiwygIntialized) {
            if (ed && !ed.isHidden()) {
                wwg_mode = true;
            }
        }

        var ctrl = document.getElementById(me.getInputId());

        if (wwg_mode) {
            ed.selection.moveToBookmark(me.storedCursorPosition);
        } else if (ctrl) {
            ctrl.setSelectionRange(me.storedCursorPosition.start, me.storedCursorPosition.end);
        }
    }, // restoreCurrentSelection
    //-----------------------------------------------------------------
    insertText: function(txt) {
        var me = this;

        var wwg_mode = false;

        var ed = tinymce.get(me.getInputId());

        if (me.wysiwygIntialized) {
            if (ed && !ed.isHidden()) {
                wwg_mode = true;
            }
        }

        var ctrl = document.getElementById(me.getInputId());

        if (wwg_mode) {
            ed.focus();
            ed.execCommand('mceInsertContent', 0, txt);
        } else if (ctrl) {
            ctrl.focus();

            var start = ctrl.selectionStart + txt.length;

            ctrl.value = ctrl.value.slice(0, ctrl.selectionStart) + txt + ctrl.value.slice(ctrl.selectionEnd);

            ctrl.setSelectionRange(start, start);
        }
    }, // insertText
    //-----------------------------------------------------------------
    beforeDestroy: function() {
        var me = this;

        var ed = tinymce.get(me.getInputId());

        if (ed) ed.destroy(false);
    },
    //-----------------------------------------------------------------
    renderActiveError: function() {

            var me = this,
                activeError = me.getActiveError(),
                hasError = !!activeError;

            var edIframe = Ext.get(me.getInputId() + "_ifr");
            if (!edIframe) {
                return me.callParent(arguments);
            }

            var ed = tinymce.get(me.getInputId());
            if (!ed) {
                return me.callParent(arguments);
            }

            var parent = edIframe.up(".mce-edit-area");
            parent = parent.up(".mce-container-body");

            if (!parent) {
                return me.callParent(arguments);
            }

            parent = parent.up(".mce-tinymce");

            if (!parent) {
                return me.callParent(arguments);
            }

            if (me.rendered && !me.isDestroyed && !me.preventMark) {

                var evHandler = function(args) {
                    me.clearInvalid();
                };

                // Add/remove invalid class
                if (hasError) {
                    parent.addCls('tinymce-error-field');

                    ed.on('keydown', evHandler);
                    ed.on('change', evHandler);
                } else {
                    parent.removeCls('tinymce-error-field');

                    ed.off('keydown', evHandler);
                    ed.off('change', evHandler);
                }
            }

            return true;
        }
        //-----------------------------------------------------------------
});
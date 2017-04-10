{
    "classAlias" : "widget.tinymce",
    "className": "Ext.ux.form.TinyMceTextArea",
    "inherits": "Ext.form.field.TextArea",
    "autoName": "MyTinyMceEditor",
    "helpText": "A TinyMCE 4 WYSIWYG editor",
    "validParentTypes": [
        "container"
    ],
    "validChildTypes": [

    ],

    "toolbox": {
        "name": "TinyMCE WYSIWYG Editor",
        "category": "Form Fields",
        "groups": [
            "Forms" 
        ] 
    },
    "configs": [
    {
        "name" : "libraryUrl",
        "type" : "uri",
        "hidden" : false,
        "initialValue" : "https://cloud.tinymce.com/stable/tinymce.min.js"
      
    },
    {
        "name" : "spellchecker_whitelistUrl",
        "type" : "uri",
        "hidden" : false,
        "initialValue" : ""
      
    },
     {
        "name" : "cssUrls",
        "type" : "string",
        "hidden" : false,
        "initialValue" : ""
      
    },
    {
        "name" : "smallButtonIcons",
        "type" : "boolean",
        "hidden" : false,
        "initialValue" : false
      
    },
    {
        "name" : "apiKey",
        "type" : "string",
        "hidden" : false,
        "initialValue" : ""
    },
    /*
    {
        "name": "iceUserName",
        "type": "string",
        "hidden": false,
        "initialValue": ""
    }, {
        name: "iceUserId",
        type: "number",
        hidden: false,
        initialValue: 0
    },
    */
     {
        name: 'tinyMCEConfig',
        type: 'object',
        hidden: false
    }, {
        name: 'noWysiwyg',
        type: 'boolean',
        hidden: false,
        initialValue: false
    }, 
    {
        name: 'combineToolbars',
        type: 'boolean',
        hidden: false,
        initialValue: false
    },
    {
        name: 'plugin_advlist',
        type: 'boolean',
        hidden: false,
        initialValue: false
    }, {
        name: 'plugin_anchor',
        type: 'boolean',
        hidden: false,
        initialValue: false
    }, {
        name: 'plugin_autolink',
        type: 'boolean',
        hidden: false,
        initialValue: false
    }, {
        name: 'plugin_autoresize',
        type: 'boolean',
        hidden: false,
        initialValue: false
    }, {
        name: 'plugin_autosave',
        type: 'boolean',
        hidden: false,
        initialValue: false
    }, {
        name: 'plugin_bbcode',
        type: 'boolean',
        hidden: false,
        initialValue: false
    }, 
    {
        name: 'plugin_charmap',
        type: 'boolean',
        hidden: false,
        initialValue: false,
        merge: false
    }, {
        name: 'plugin_code',
        type: 'boolean',
        hidden: false,
        initialValue: false
    },
    {   
        name: 'plugin_advcode',
        type: 'boolean',
        hidden: false,
        initialValue: false
    },
     {
        name: 'plugin_compat3x',
        type: 'boolean',
        hidden: false,
        initialValue: false
    }, {
        name: 'plugin_contextmenu',
        type: 'boolean',
        hidden: false,
        initialValue: false
    }, {
        name: 'plugin_directionality',
        type: 'boolean',
        hidden: false,
        initialValue: false
    }, {
        name: 'plugin_emoticons',
        type: 'boolean',
        hidden: false,
        initialValue: false
    }, {
        name: 'plugin_fullpage',
        type: 'boolean',
        hidden: false,
        initialValue: false
    }, {
        name: 'plugin_fullscreen',
        type: 'boolean',
        hidden: false,
        initialValue: true
    }, {
        name: 'plugin_image',
        type: 'boolean',
        hidden: false,
        initialValue: false
    }, {
        name: 'image_list',
        type: 'array',
        hidden: false,
        initialValue: null
    }, {
        name: 'plugin_legacyoutput',
        type: 'boolean',
        hidden: false,
        initialValue: false
    }, {
        name: 'plugin_link',
        type: 'boolean',
        hidden: false,
        initialValue: false
    }, {
        name: 'plugin_lists',
        type: 'boolean',
        hidden: false,
        initialValue: false
    }, {
        name: 'plugin_importcss',
        type: 'boolean',
        hidden: false,
        initialValue: false
    }, {
        name: 'plugin_media',
        type: 'boolean',
        hidden: false,
        initialValue: false
    }, {
        name: 'plugin_nonbreaking',
        type: 'boolean',
        hidden: false,
        initialValue: false
    }, {
        name: 'plugin_noneditable',
        type: 'boolean',
        hidden: false,
        initialValue: false
    }, {
        name: 'plugin_pagebreak',
        type: 'boolean',
        hidden: false,
        initialValue: false
    }, {
        name: 'plugin_paste',
        type: 'boolean',
        hidden: false,
        initialValue: true
    }, {
        name: 'plugin_preview',
        type: 'boolean',
        hidden: false,
        initialValue: false
    }, {
        name: 'plugin_print',
        type: 'boolean',
        hidden: false,
        initialValue: false
    }, {
        name: 'plugin_save',
        type: 'boolean',
        hidden: false,
        initialValue: false
    }, {
        name: 'plugin_searchreplace',
        type: 'boolean',
        hidden: false,
        initialValue: false
    }, {
        name: 'plugin_spellchecker',
        type: 'boolean',
        hidden: false,
        initialValue: false
    },
    {
        name: 'plugin_tinymcespellchecker',
        type: 'boolean',
        hidden: false,
        initialValue: false
    },
    {
        name: 'spellchecker_language',
        type: 'string',
        initialValue: 'en',
        hidden: false
    },
     {
        name: 'plugin_table',
        type: 'boolean',
        hidden: false,
        initialValue: false
    }, {
        name: 'plugin_textcolor',
        type: 'boolean',
        hidden: false,
        initialValue: false
    }, {
        name: 'plugin_visualblocks',
        type: 'boolean',
        hidden: false,
        initialValue: false
    }, {
        name: 'plugin_visualchars',
        type: 'boolean',
        hidden: false,
        initialValue: false
    }, {
        name: 'plugin_wordcount',
        type: 'boolean',
        hidden: false,
        initialValue: false
    }, 
    /*
    {
        name: 'plugin_ice',
        type: 'boolean',
        hidden: false,
        initialValue: false
    }, {
        name: 'plugin_icesearchreplace',
        type: 'boolean',
        hidden: false,
        initialValue: false
    }, 
    */
    {
        name: 'font_formats',
        type: 'string',
        hidden: false,
        initialValue: null,
        // initialValue: "Arial=arial,helvetica,sans-serif;Comic Sans MS=comic sans ms,sans-serif;",
        merge: false
    }, {
        name: 'statusbar',
        type: 'boolean',
        hidden: false,
        initialValue: 'true'
    }, {
        name: 'showFormattingToolbar',
        type: 'boolean',
        hidden: false,
        initialValue: true
    }, {
        name: 'showEditorMenu',
        type: 'boolean',
        hidden: false,
        initialValue: false
    }, {
        name: 'showCustomMenu',
        type: 'boolean',
        hidden: false,
        initialValue: false
    }, {
        name: 'browserSpellCheck',
        type: 'boolean',
        hidden: false,
        initialValue: false
    },  
    /*
    {
        name: 'hideToolbarOnBlur',
        type: 'boolean',
        hidden: false,
        initialValue: null
    },
    */
    {
        name: 'customEditorMenu',
        type: 'object',
        hidden: false,
        merge: false,
        initalValue: null
        /*
        initialValue: {
            edit: {
                title: 'Edit',
                items: 'undo redo|cut copy paste | selectall'
            },
            insert: {
                title: 'Insert',
                items: '|'
            },
            view: {
                title: 'View',
                items: 'visualaid'
            },
            format: {
                title: 'Format',
                items: 'bold italic underline strikethrough superscript subscript | formats | removeformat'
            }
        }
        */
    }, {
        name: 'formattingToolbar',
        type: 'string',
        initialValue: 'undo redo | bold italic underline strikethrough superscript subscript | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat',
        hidden: false,
        merge: false
    }]
}
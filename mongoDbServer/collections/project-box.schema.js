// Define Project as a Meteor collection
ProjectBox = new Meteor.Collection("projectBox");

// Create schema
ProjectSchema = new SimpleSchema({
    project_id: {
        label: "project id",
        type: String,
        index: true,
        optional: true
    },
    project_name: {
        label: "project name",
        type: String,
        optional: true
    },
    assets: {
        type: [Object],
        label: "collection of project assets",
        optional: true
    },
    "assets.$.asset_id": {
        label: "asset id",
        type: String,
        index: true,
        optional: true
    },
    "assets.$.asset_type": {
        label: "type of asset",
        type: String,
        optional: true
    },
    "assets.$.file_name": {
        label: "asset file name",
        type: String,
        optional: true
    },
    "assets.$.file_extension": {
        label: "asset file extention",
        type: String,
        optional: true
    },
    "assets.$.file_content": {
        label: "file content in base64",
        type: String,
        optional: true
    },
    "assets.$.external_path": {
        label: "external asset location",
        type: String,
        optional: true
    },
    "assets.$.added": {
        type: Date,
        label: "Date asset added to project",
        autoValue: function() {
            if (!this.isSet && this.operator !== "$pull") {
                return new Date();
            }
        },
        optional: true
    },
    pages: {
        label: "project page collection",
        type: [Object],
        optional: true
    },
    "pages.$.page_id": {
        label: "page id",
        type: String,
        index: true,
        optional: true
    },
    "pages.$.page_site_id": {
        label: "id of associated site",
        type: String,
        optional: true
    },
    "pages.$.page_template_id": {
        label: "id of associated template",
        type: String,
        optional: true
    },
    "pages.$.page_name": {
        label: "page name",
        type: String,
        optional: true
    },
    "pages.$.page_content": {
        label: "page content",
        type: [String],
        blackbox: true,
        optional: true
    },
    "pages.$.page_added": {
        type: Date,
        label: "Date page added to site",
        autoValue: function() {
            if (!this.isSet && this.operator !== "$pull") {
                return new Date();
            }
        },
        optional: true
    },
    sites: {
        label: "project site collection",
        type: [Object],
        optional: true
    },
    "sites.$.site_id": {
        label: "site id",
        type: String,
        index: true,
        optional: true
    },
    "sites.$.site_name": {
        label: "name of site",
        type: String,
        optional: true
    },
    templates: {
        type: [Object],
        label: "project template collection",
        optional: true
    },
    "templates.$.template_id": {
        label: "template id",
        type: String,
        index: true,
        optional: true
    },
    "templates.$.template_name": {
        label: "name of template",
        type: String,
        optional: true
    },
    "templates.$.template_structure": {
        label: "template structure",
        type: [String],
        optional: true
    },
    project_added: {
        type: Date,
        label: "Date project created",
        autoValue: function() {
            if (this.isInsert) {
                return new Date();
            }
        },
        optional: true
    }
});

// Attach Schema
ProjectBox.attachSchema(ProjectSchema);
Meteor.startup(function () {
    var userId      = "041562ddce22f56c2087e6f1",
        projectId   = new Meteor.Collection.ObjectID().toHexString(),
        siteId0     = new Meteor.Collection.ObjectID().toHexString(),
        siteId1     = new Meteor.Collection.ObjectID().toHexString(),
        templateId0 = new Meteor.Collection.ObjectID().toHexString(),
        templateId1 = new Meteor.Collection.ObjectID().toHexString(),
        templateId2 = new Meteor.Collection.ObjectID().toHexString();

    var defaultUser = {
        user_id:userId,
        username:"Jerry Seinfeld",
        email:"j.seinfeld@nbc.com",
        projects:[]
    };

    var projectContent = {
        project_id:projectId,
        project_name:"My Project",
        pages: [
            {
                page_id:new Meteor.Collection.ObjectID().toHexString(),
                page_site_id:siteId0,
                page_template_id:templateId0,
                page_name:"Home Page",
                page_content: [
                    "<section>",
                    "<h1 data-bl-area-0>Awesome Mind Blowing Copy</h1>",
                    "<p data-bl-area-1>Copy about current events ",
                    "<span data-bl-area-2>highlighted by a span here.</span>",
                    "</p>",
                    "<div data-bl-area-3>",
                    "Last bit of content here.</div>",
                    "</section>"
                ]
            },
            {
                page_id:new Meteor.Collection.ObjectID().toHexString(),
                page_site_id:siteId0,
                page_template_id:templateId2,
                page_name:"Contact Us",
                page_content: [
                    "<div>",
                    "<article data-bl-area-0>Love To Hear From You</article>",
                    "<p data-bl-area-1>Fantastic Super Great Copy",
                    "<p data-bl-area-2>Ultra Neat Things To Say</p>",
                    "</p>",
                    "<aside data-bl-area-3>Random Shit Goes Here",
                    "</aside>",
                    "</div>"
                ]
            },
            {
                page_id:new Meteor.Collection.ObjectID().toHexString(),
                page_site_id:siteId0,
                page_template_id:templateId1,
                page_name:"About Us",
                page_content: [
                    "<ul>",
                    "<li data-bl-area-0>Clever Shit About Our Company</li>",
                    "</ul>"
                ]
            },
            {
                page_id:new Meteor.Collection.ObjectID().toHexString(),
                page_site_id:siteId1,
                page_template_id:templateId1,
                page_name:"Home Page",
                page_content: [
                    "<ul>",
                    "<li data-bl-area-0>Why Luke Skywalking is NOT a Sith!</li>",
                    "</ul>"
                ]
            },
            {
                page_id:new Meteor.Collection.ObjectID().toHexString(),
                page_site_id:siteId1,
                page_template_id:templateId0,
                page_name:"Blog Post Archive",
                page_content: [
                    "<section>",
                    "<h1 data-bl-area-0>My Thoughts</h1>",
                    "<p data-bl-area-1>Get caught up here ",
                    "<span data-bl-area-2>highlighted by a span here.</span>",
                    "</p>",
                    "<div data-bl-area-3>",
                    "Last bit of blogging here.</div>",
                    "</section>"
                ]
            },
            {
                page_id:new Meteor.Collection.ObjectID().toHexString(),
                page_site_id:siteId1,
                page_template_id:templateId2,
                page_name:"Forum",
                page_content: [
                    "<div>",
                    "<article data-bl-area-0>Rules: What Happens In These Forums...</article>",
                    "<p data-bl-area-1>some forum copy",
                    "<p data-bl-area-2>additional forum copy</p>",
                    "</p>",
                    "<aside data-bl-area-3>",
                    "copy copy copy</aside>",
                    "</div>"
                ]
            }
        ],
        sites: [
            {
                site_id:siteId0,
                site_name:"Basic Hello World"
            },
            {
                site_id:siteId1,
                site_name:"Star Wars Fan Blog"
            }
        ],
        templates:[
            {
                template_id:templateId0,
                template_name:"Starter",
                template_structure:[
                    "<section>",
                    "<h1 data-bl-area-0></h1>",
                    "<p data-bl-area-1>",
                    "<span data-bl-area-2></span>",
                    "</p>",
                    "<div data-bl-area-3>",
                    "</div>",
                    "</section>"
                ]
            },
            {
                template_id:templateId1,
                template_name:"List",
                template_structure:[
                    "<ul>",
                    "<li data-bl-area-0></li>",
                    "</ul>"
                ]
            },
            {
                template_id:templateId2,
                template_name:"Article",
                template_structure:[
                    "<div>",
                    "<article data-bl-area-0></article>",
                    "<p data-bl-area-1>",
                    "<p data-bl-area-2></p>",
                    "</p>",
                    "<aside data-bl-area-3>",
                    "</aside>",
                    "</div>"
                ]
            }
        ]
    };

    if (UserBox.find().count() === 0 ) {
        Meteor.call("addUser", defaultUser);
    }

    if (ProjectBox.find().count() === 0) {
        Meteor.call("addProject", projectContent, function() {
            Meteor.call("assignToProject", projectId, userId);
        });
    }
});
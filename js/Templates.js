var Templates = {
    TemplateArray: {},
    loadTemplates: function (templatesFilePath) {
        //  var templatesFilePath = csInterface.getSystemPath(SystemPath.EXTENSION) + "/templates/templates.json";
        $.getJSON(templatesFilePath, function (data) {
            Templates.TemplateArray = data;
            Templates.printTemplatesSizes(data)
        })
    },
    printTemplatesSizes: function (data) {
        for (var i = 0; i < data.template_categories.length; i++) {
            $(document.createElement('div'));
            $('<div/>', {
                'data-id': i,
                'data-size': data.template_categories[i].name,
                'class': 'template-size-option',
                'html': '<div class="template-size-thumb"></div><div class="template-size-name"' + '>' + data.template_categories[i].name + '</div>'
            }).appendTo('#spread-size-options');
        }

    },

    showAvailableTemplates: function (count, spreadSize, SystemPath) {
        $('#template-items').empty();
        for (var i = 0, size_group; size_group = Templates.TemplateArray.template_categories[i]; i++) {
            if (size_group.name == spreadSize) {

                for (var j = 0, quantity_group; quantity_group = size_group.quantity_categories[j]; j++) {
                    if (quantity_group.quantity == count) {
                        for (var k = 0, template; template = quantity_group.templates[k]; k++) {
                            var previev = SystemPath + "/templates/" + size_group.name + "_" + quantity_group.quantity + "_" + template.id + ".png";
                            $('<div/>', {
                                'id': '',
                                'class': 'template-size-thumb',
                                'data-category': i,
                                'data-quantity_group': j,
                                'data-template_id': k,
                                'html': '<img src="' + previev + '">'
                            }).appendTo('#template-items');
                        }
                    }
                }
            }
        }
    },
    getParamsById: function (name) {
        try {
            return {
                width: this.TemplateArray.template_categories[name].page_size.width,
                height: this.TemplateArray.template_categories[name].page_size.height
            };
        }
        catch (error) {
            console.log("Templates.[getParamsById] : Template category: " + name + " not found");
        }
    }
};


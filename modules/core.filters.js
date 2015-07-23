"use strict";



var filters = angular.module("core.filters", [])
    .config(function ($filterProvider) {

        /* Ôèëüòğ îïîğ ïî id ëèíèè */
        $filterProvider.register("pagination", [ function () {
            return function (input, itemsOnPage, pageNumber) {
                if (itemsOnPage !== undefined && pageNumber !== undefined) {
                    var items = [];
                    var start = (pageNumber * itemsOnPage) - itemsOnPage + 1;
                    angular.forEach(input, function (item, key) {
                        if (key >= start && key <= (start + itemsOnPage) - 1)
                            items.push(item);
                    });
                    return items;
                } else
                    return input;
            };
        }]);

    })
    .run(function () {

    }
);
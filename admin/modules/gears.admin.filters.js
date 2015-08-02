var admFilters = angular.module("gears.admin.filters", [])
    .config(function ($filterProvider) {

        /**
         * usedFlowers
         * Фильтр цветов, не входящих в состав букета
         */
        $filterProvider.register("usedFlowers", ["$log", "$flowers", "$misc", function ($log, $flowers, $misc) {
            return function (input, bouquetId) {
                var result = [];
                if (bouquetId !== undefined) {
                    var bouquet = $flowers.bouquets.find("id", bouquetId);
                    angular.forEach($misc.flowers.items, function (flower) {
                        if (bouquet.flowers.find("flowerId", flower.id.value) === false)
                            result.push(flower);
                    });
                    return result;
                } else
                    return input;
            }
        }]);


        /**
         * usedAdditions
         * Фильтр декоративных элементов, не входящих в состав букета
         */
        $filterProvider.register("usedAdditions", ["$log", "$flowers", "$misc", function ($log, $flowers, $misc) {
            return function (input, bouquetId) {
                var result = [];
                if (bouquetId !== undefined) {
                    var bouquet = $flowers.bouquets.find("id", bouquetId);
                    angular.forEach($misc.additions.items, function (addition) {
                        if (bouquet.additions.find("additionId", addition.id.value) === false)
                            result.push(addition);
                    });
                    return result;
                } else
                    return input;
            }
        }]);

    })
    .run(function () {

    });



storeApp.controller('AdminController', function ($scope, $filter) {
    $scope.isActive = false;
    $scope.sections = [
    //        { name: 'Grid View', class: "cbp-vm-grid" },
        {name: 'List View', class: "cbp-vm-list"}];

    $scope.setMaster = function (section) {
        $scope.selected = section;
        $scope.isActive = !$scope.isActive;
    }

    $scope.isSelected = function (section) {
        return $scope.selected === section;
    }

    var myStore = new store();
    $scope.currentPage = 0;
    $scope.pageSize = 9;
    $scope.numberOfPages = Math.ceil(myStore.products.length / $scope.pageSize);

    $scope.filteredItems = [];
    $scope.groupedItems = [];
    $scope.pagedItems = [];

    var searchMatch = function (haystack, needle) {
        if (!needle) {
            return true;
        }
        return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
    };
    $scope.search = function (name) {
        $scope.filteredItems = $filter('filter')(myStore.products, function (product) {
            for (var attr in product) {
                if (searchMatch(product[name], $scope.query))
                    return true;
            }
            return false;
        });
        $scope.currentPage = 0;
        $scope.groupToPages();
    };
    $scope.myFilter = function (column, category) {
        $scope.filteredItems = $filter('filter')(myStore.products, function (product) {
            for (var attr in product) {
                if (searchMatch(product[column], category))
                    return true;
            }
            return false;
        });
        $scope.currentPage = 0;
        $scope.groupToPages();
    };
    $scope.groupToPages = function () {
        $scope.pagedItems = [];

        for (var i = 0; i < $scope.filteredItems.length; i++) {
            if (i % $scope.pageSize === 0) {
                $scope.pagedItems[Math.floor(i / $scope.pageSize)] = [$scope.filteredItems[i]];
            } else {
                $scope.pagedItems[Math.floor(i / $scope.pageSize)].push($scope.filteredItems[i]);
            }
        }
    };
    // functions have been describe process the data for display
    $scope.myFilter();
    $scope.search();

});


// { num: 7, code: 'GUA', category: 'headgear', name: 'Header Band', src: "img/eon-tech-header-band.jpg", description: '. ', price: 110, cal: 10 },
// { num: 8, code: 'GUA', category: 'accessories', name: 'Flyability Drone', src: "img/flyability.png", description: '. ', price: 7500, cal: 10 }

function store() {
    this.products = [
          { num: 1, code: 'headgear', category: 'headgear', name: 'Pro Headgear', src: "img/eon-tech-helmet-pro.png", description: '. ', price: 180, cal: 10 },
          { num: 2, code: 'body-armor', category: 'armor', name: 'Body Armor', src: "img/eon-tech-chest-plate.png", description: '. ', price: 150, cal: 10 },
          { num: 3, code: 'leg-protection', category: 'armor', name: 'Leg Guards', src: "img/eon-tech-leg-guard.png", description: '. ', price: 130, cal: 10 },
          { num: 4, code: 'BAN', category: 'accessories', name: 'Neck Protector', src: "img/eon-tech-neck-support.jpg", description: '. ', price: 100, cal: 10 },
          { num: 5, code: 'CTP', category: 'headgear', name: 'Basic Headgear', src: "img/eon-tech-helmet.png", description: '. ', price: 140, cal: 10 },
          { num: 6, code: 'GRP', category: 'accessories', name: 'Cord Suspension Kit', src: "img/eon-tech-cord-suspension.jpg", description: '. ', price: 40, cal: 10 }];
}

function detailsprod() {
    this.details = [];
    this.detailsX = [
         { id: 'APL', src1: 'processor.png', component: 'Processor', processor: '2.9GHz Quad-core Intel Core i5, Turbo Boost up to 3.6GHz', src2: 'memory.png', component2: 'Memory', memory: '4GB 1600MHz LPDDR3 SDRAM', src3: 'drive.png', component3: 'Hard Drive', drive: '500GB Serial ATA Drive @ 5400 rpm' },
         { id: 'AVC', src1: 'processor.png', component: 'Processor', processor: '1.3GHz Dual-Core Intel Core i5, Turbo Boost up to 2.6GHz', src2: 'memory2.png', component2: 'Memory', memory: '2GB 1300MHz LPDDR3 SDRAM', src3: 'drive.png', component3: 'Hard Drive', drive: '1TB Serial ATA Drive @ 5400 rpm' },
         { id: 'BAN', src1: 'processor.png', component: 'Processor', processor: '1.9GHz Quad-core Intel Core i5, Turbo Boost up to 5.3GHz', src2: 'memory.png', component2: 'Memory', memory: '8GB 1200MHz LPDDR3 SDRAM', src3: 'drive.png', component3: 'Hard Drive', drive: '500GB Serial ATA Drive @ 5400 rpm' },
         { id: 'CTP', src1: 'processor.png', component: 'Processor', processor: '4GHz Quad-core Intel Core i2, Turbo Boost up to 1.6GHz', src2: 'memory.png', component2: 'Memory', memory: '1GB 1600MHz LPDDR3 SDRAM', src3: 'drive.png', component3: 'Hard Drive', drive: '128GB Solid State Drive' },
         { id: 'FIG', src1: 'processor.png', component: 'Processor', processor: '1GHz Dual-core Intel Core i3, Turbo Boost up to 3.5GHz', src2: 'memory2.png', component2: 'Memory', memory: '2GB 1200MHz LPDDR3 SDRAM', src3: 'drive.png', component3: 'Hard Drive', drive: '50GB Serial ATA Drive @ 5400 rpm' },
         { id: 'GRP', src1: 'processor.png', component: 'Processor', processor: '1GHz Quad-core Intel Core i8, Turbo Boost up to 2.1GHz', src2: 'memory.png', component2: 'Memory', memory: '5GB 1600MHz LPDDR3 SDRAM', src3: 'drive.png', component3: 'Hard Drive', drive: '256GB Solid State Drive' },
         { id: 'GUA', src1: 'processor.png', component: 'Processor', processor: '3GHz Quad-core Intel Core i3, Turbo Boost up to 3.4GHz', src2: 'memory.png', component2: 'Memory', memory: '8GB 1300MHz LPDDR3 SDRAM', src3: 'drive.png', component3: 'Hard Drive', drive: '256GB Solid State Drive' },
         { id: 'KIW', src1: 'processor.png', component: 'Processor', processor: '5GHz Quad-core Intel Core i6, Turbo Boost up to 2.3GHz', src2: 'memory.png', component2: 'Memory', memory: '3GB 1600MHz LPDDR3 SDRAM', src3: 'drive.png', component3: 'Hard Drive', drive: '50GB Serial ATA Drive @ 5400 rpm' },
         { id: 'ORG', src1: 'processor.png', component: 'Processor', processor: '4GHz Quad-core Intel Core i9, Turbo Boost up to 1.6GHz', src2: 'memory.png', component2: 'Memory', memory: '4GB 1700MHz LPDDR3 SDRAM', src3: 'drive.png', component3: 'Hard Drive', drive: '500GB Serial ATA Drive @ 5400 rpm' },
         { id: 'LSS', src1: 'processor.png', component: 'Processor', processor: '2.9GHz Quad-core Intel Core i5, Turbo Boost up to 3.6GHz', src2: 'memory.png', component2: 'Memory', memory: '4GB 1600MHz LPDDR3 SDRAM', src3: 'drive.png', component3: 'Hard Drive', drive: '500GB Serial ATA Drive @ 5400 rpm' },
         { id: 'LAA', src1: 'processor.png', component: 'Processor', processor: '1.3GHz Dual-Core Intel Core i5, Turbo Boost up to 2.6GHz', src2: 'memory2.png', component2: 'Memory', memory: '2GB 1300MHz LPDDR3 SDRAM', src3: 'drive.png', component3: 'Hard Drive', drive: '1TB Serial ATA Drive @ 5400 rpm' },
         { id: 'LBB', src1: 'processor.png', component: 'Processor', processor: '1.9GHz Quad-core Intel Core i5, Turbo Boost up to 5.3GHz', src2: 'memory.png', component2: 'Memory', memory: '8GB 1200MHz LPDDR3 SDRAM', src3: 'drive.png', component3: 'Hard Drive', drive: '500GB Serial ATA Drive @ 5400 rpm' },
         { id: 'LCC', src1: 'processor.png', component: 'Processor', processor: '4GHz Quad-core Intel Core i2, Turbo Boost up to 1.6GHz', src2: 'memory.png', component2: 'Memory', memory: '1GB 1600MHz LPDDR3 SDRAM', src3: 'drive.png', component3: 'Hard Drive', drive: '128GB Solid State Drive' },
         { id: 'LDD', src1: 'processor.png', component: 'Processor', processor: '1GHz Dual-core Intel Core i3, Turbo Boost up to 3.5GHz', src2: 'memory2.png', component2: 'Memory', memory: '2GB 1200MHz LPDDR3 SDRAM', src3: 'drive.png', component3: 'Hard Drive', drive: '50GB Serial ATA Drive @ 5400 rpm' },
         { id: 'LEE', src1: 'processor.png', component: 'Processor', processor: '1GHz Quad-core Intel Core i8, Turbo Boost up to 2.1GHz', src2: 'memory.png', component2: 'Memory', memory: '5GB 1600MHz LPDDR3 SDRAM', src3: 'drive.png', component3: 'Hard Drive', drive: '256GB Solid State Drive' },
         { id: 'LFF', src1: 'processor.png', component: 'Processor', processor: '3GHz Quad-core Intel Core i3, Turbo Boost up to 3.4GHz', src2: 'memory.png', component2: 'Memory', memory: '8GB 1300MHz LPDDR3 SDRAM', src3: 'drive.png', component3: 'Hard Drive', drive: '256GB Solid State Drive' },
         { id: 'LGG', src1: 'processor.png', component: 'Processor', processor: '5GHz Quad-core Intel Core i6, Turbo Boost up to 2.3GHz', src2: 'memory.png', component2: 'Memory', memory: '3GB 1600MHz LPDDR3 SDRAM', src3: 'drive.png', component3: 'Hard Drive', drive: '50GB Serial ATA Drive @ 5400 rpm' },
         { id: 'LHH', src1: 'processor.png', component: 'Processor', processor: '4GHz Quad-core Intel Core i9, Turbo Boost up to 1.6GHz', src2: 'memory.png', component2: 'Memory', memory: '4GB 1700MHz LPDDR3 SDRAM', src3: 'drive.png', component3: 'Hard Drive', drive: '500GB Serial ATA Drive @ 5400 rpm'}];

}


store.prototype.getProduct = function (code) {
    for (var i = 0; i < this.products.length; i++) {
        if (this.products[i].code == code)
            return this.products[i];
    }
    
    return null;
}
detailsprod.prototype.getDetail = function (code) {
    for (var i = 0; i < this.details.length; i++) {
        if (this.details[i].id == code)
            
            return this.details[i];
        
    }
    return null;
}

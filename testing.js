var test = Factory(["contacts"], ["test"]);
console.log(test);
Factory([], ["states"] ,test);

console.log("________________________________________");


function Asshole () {
    this.public = "public variable";
    var priv = "private variable";
};

var ass = new Asshole();

Factory([], ["states", "initiator"], ass);
console.log(ass);
//var test = Factory(["contacts"], ["test"]);
//console.log(test);
//Factory([], ["states"] ,test);

//console.log("________________________________________");


//function Asshole () {
//    this.public = "public variable";
//    var priv = "private variable";
//};

//var ass = new Asshole();

//Factory([], ["states", "initiator"], ass);
//console.log(ass);

function Test () {
    this.id = new Field({ source: "id_source", value: 12, backupable: true });
    this.title = new Field({ source: "title_source", value: "testing"});
};

var test = new Test();


//var col = new Collection();
//col.append(1);
//col.append(2);
//col.append(3);
//col.append(new Test());

//var mod = new Model();
//col.append(mod);


//col.display();


var f = new Factory({ classes: ["States", "Backup"], base_class: "Testclass", destination: test });
f.backup.setup();
console.log(f);




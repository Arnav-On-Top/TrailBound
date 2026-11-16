
var trips=JSON.parse(localStorage.getItem("trips"))||[];
var currentTripIndex=-1;
function saveTrips(){
    localStorage.setItem("trips",JSON.stringify(trips));
}
function showCreateForm(){
    document.getElementById("createForm").classList.remove("hidden");
}
function hideCreateForm(){
    document.getElementById("createForm").classList.add("hidden");
}
function createTrip(){
    var name=document.getElementById("tripName").value;
    var destination=document.getElementById("destination").value;
    var date=document.getElementById("startDate").value;
    var people=document.getElementById("people").value;
    var duration=document.getElementById("duration").value;
    var type=document.getElementById("tripType").value;
    if(name=="" || destination=="" || date=="" || duration=="" || people==""){
        alert("Please fill in all details");
        return;
    }
    if(Number(duration)<1 || Number(people)<1){
        alert("Duration and number of people must be at least 1");
        return;
    }
    var packingItems=[
        {name: "Backpack", packed:false},
        {name: "Water Bottle", packed: false},
        {name: "First Aid Kit", packed: false},
        {name: "Flashlight", packed: false},
        {name: "Food", packed: false},
        {name: "Extra clothes", packed: false},
        {name: "Map and Compass", packed: false}
    ];
    var newTrip={
        name: name,
        destination: destination,
        date: date,
        duration: Number(duration),
        people: Number(people),
        type: type,
        items: packingItems
    };
    trips.push(newTrip);
    saveTrips();
    document.getElementById("tripName").value="";
    document.getElementById("destination").value="";
    document.getElementById("startDate").value="";
    document.getElementById("duration").value="";
    document.getElementById("people").value="";
    hideCreateForm();
    showTrips();
}
function showTrips(){
    var tripList=document.getElementById("tripList");
    tripList.innerHTML="";
    if(trips.length==0){
        tripList.innerHTML="<p>Nothing Planned Yet</p>"
    }
    for(var i=0; i<trips.length; i++){
        var trip=trips[i];
        var tripCard=document.createElement("div");
        tripCard.className="trip-card";

        var heading=document.createElement("h3");
        heading.textContent=trip.destination;
        tripCard.appendChild(heading);

        var dateText=document.createElement("p");
        dateText.textContent=trip.date;
        tripCard.appendChild(dateText);

        var durationText=document.createElement("p");
        durationText.textContent=trip.duration+" days";
        tripCard.appendChild(durationText);

        var peopleText=document.createElement("p");
        peopleText.textContent=trip.people+" people";
        tripCard.appendChild(peopleText);

        var typeText=document.createElement("p");
        typeText.textContent=trip.type;
        tripCard.appendChild(typeText);

        var viewButton=document.createElement("button");
        viewButton.textContent="View";
        viewButton.onclick=function(index){
            return function(){
                openTrip(index);
            };
        }(i);
        tripCard.appendChild(viewButton);

        tripList.appendChild(tripCard);
    }
}
function openTrip(index){
    currentTripIndex=index;
    document.getElementById("homePage").classList.add("hidden");
    document.getElementById("plannerPage").classList.remove("hidden");
    showTripDetails();
    showPackingList();
    calculateSupplies();
}
function showTripDetails(){
    var trip=trips[currentTripIndex];
    document.getElementById("plannerTitle").innerText=trip.name;
    document.getElementById("plannerDestination").innerText=trip.destination;
    document.getElementById("tripDate").innerText="Start Date: "+ trip.date;
    document.getElementById("tripDuration").innerText="Duration: "+trip.duration+" days";
    document.getElementById("tripPeople").innerText="People: "+trip.people;
    document.getElementById("tripTypeText").innerText="Expedition Type: " + trip.type;
}
function showPackingList(){
    var trip=trips[currentTripIndex];
    var packingList=document.getElementById("packingList");
    packingList.innerHTML="";
    var packedCount=0;
    for(var i=0; i<trip.items.length; i++){
        var item=trip.items[i];
        if(item.packed==true){
            packedCount++;
        }

        var packingItem=document.createElement("div");
        packingItem.className="packing-item";

        var checkbox=document.createElement("input");
        checkbox.type="checkbox";
        checkbox.id="item"+i;
        checkbox.checked=item.packed;
        checkbox.onchange=function(index){
            return function(){
                toggleItem(index);
            };
        }(i);
        packingItem.appendChild(checkbox);

        var label=document.createElement("label");
        label.htmlFor="item"+i;
        label.textContent=item.name;
        packingItem.appendChild(label);

        packingList.appendChild(packingItem);
    }
    var totalItems=trip.items.length;
    var progress=0;
    if(totalItems>0){
        progress=(packedCount/totalItems)*100;
    }
    document.getElementById("progressBar").style.width=progress+"%";
    document.getElementById("progressText").innerText=packedCount+"out of "+totalItems+"items packed";
}
function toggleItem(index){
    var trip=trips[currentTripIndex];
    if (trip.items[index].packed==true){
        trip.items[index].packed=false;
    }
    else{
        trip.items[index].packed=true;
    }
    saveTrips();
    showPackingList();
}
function addItem(){
    var itemName=document.getElementById("extraItem").value;
    if(itemName==""){
        alert("Please enter an item name.");
        return;
    }
    var trip=trips[currentTripIndex];
    var newItem={
        name: itemName,
        packed: false
    };
    trip.items.push(newItem);
    saveTrips();
    document.getElementById("extraItem").value="";
    showPackingList();
}
function calculateSupplies(){
    var trip=trips[currentTripIndex];
    var water=trip.people*trip.duration*3;
    var food=trip.people*trip.duration*3;
    document.getElementById("waterResult").innerText="Water Required: "+water+" litres";
    document.getElementById("foodResult").innerText="Food Required: "+food+" meals";
}
function goHome(){
    document.getElementById("plannerPage").classList.add("hidden");
    document.getElementById("homePage").classList.remove("hidden");
    currentTripIndex=-1;
    showTrips();
}
function deleteTrip(){
    var answer=confirm("Are you sure?");
    if(answer==true){
        trips.splice(currentTripIndex,1);
        saveTrips();
        goHome();
    }
}
function escapeHTML(text){
    return String(text)
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#039;");
}
showTrips();

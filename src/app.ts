import axios from "axios";

// selectors from index
const form = document.querySelector("form")!;
const addressInput = document.getElementById("address")! as HTMLInputElement;

// key from Google
const GOOGLE_API_KEY = "AIzaSyCJlzct62Z_9ndCV1hOnEeRBK9ZoW5THag";

// to avoid error
declare var google: any;

// Custom type
// response type to get lat and lng
type GoogleGeocodingResponse = {
    results: { geometry: { location: { lat: number; lng: number } } }[];
    status: "OK" | "ZERO_RESULTS";
};

function searchAddressHandler(event: Event) {
    event.preventDefault();
    const enteredAddress = addressInput.value;

    // Promise with API request and custom type
    axios
        .get<GoogleGeocodingResponse>(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
                enteredAddress
            )}&key=${GOOGLE_API_KEY}`
        )
        .then(response => {
            if (response.data.status !== "OK") {
                throw new Error("Could not fetch location!");
            }
            // console.log(response);
            const coordinates = response.data.results[0].geometry.location;
            // console.log(coordinates);
            const map = new google.maps.Map(document.getElementById("map"), {
                center: coordinates,
                zoom: 8
            });

            new google.maps.Marker({ position: coordinates, map: map });
        })
        .catch(err => {
            alert(err.message);
            console.log(err);
        });
}

form.addEventListener("submit", searchAddressHandler);

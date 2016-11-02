/**
 * Created by samuel on 10/26/2016.
 */
$(function () {

    // Initialize nativeDroid2

    $.nd2({
        stats: {
            analyticsUA: "UA-3190500-49" // Your UA-Code for Example: 'UA-123456-78'
        },
        advertising: {
            active: true, // true | false
            path: "/examples/fragments/adsense/", // Define where the Ad-Templates are: For example:
            extension: ".html" // Define the Ad-Template content Extension (Most case: ".html" or ".php")
        }
    });
});
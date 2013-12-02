/**
 * Created by kingHenry on 12/1/13.
 */


$(document).ready(function(){
    $('#prettyTable').dataTable({
        "aLengthMenu": [[5,10, 25, 50, -1], [5,10, 25, 50, "All"]],
        "iDisplayLength" : 5
    });
});
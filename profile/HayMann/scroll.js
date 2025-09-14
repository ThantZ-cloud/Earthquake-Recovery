
    const slider = document.getElementById("slider");
    const items = slider.querySelectorAll(".item");
    

    items.forEach(function(item) {
  item.addEventListener("click", function() {
    slider.style.animationPlayState = 
      slider.style.animationPlayState === "paused" ? "running" : "paused";
  });
});


    
  

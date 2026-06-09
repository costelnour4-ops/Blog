function load_blogs(){
fetch('http://localhost:3000/get-blog')
    .then(response=> response.json())
    .then(blogs=>{
        const lista_bloguri=document.getElementById("lista-bloguri");
        lista_bloguri.innerHTML="";
        
        blogs.forEach(blog => {
            const blogWrapper = document.createElement('div');
                blogWrapper.className = "blog-post-container";
            blogWrapper.innerHTML = `
                    <div class="blog-post">
                    <div>
                        <h3>${blog.Title}</h3>
                        <small>${blog.date}</small>
                        <p>${blog.Body}</p>
                    </div>
                    <div>
                    <button class="View">View</button>
                    </div>
                    </div>
                    <hr>
                `;
           const viewButton = blogWrapper.querySelector('.View');

viewButton.onclick = function(event) {
    event.stopPropagation();
    document.querySelector(".create-blog").style.display="flex";
    event.stopPropagation();
    idBlogInEditare=blog.id;
    document.getElementById("title").value = blog.Title;
    document.getElementById("content").value = blog.Body;

};
            lista_bloguri.appendChild(blogWrapper);
        });
      
    })
.catch(error => console.error("A apărut o eroare la descărcare:", error));
}
window.onclick=function(event){
    if (!document.querySelector(".create-blog").contains(event.target)) {
        document.querySelector(".create-blog").style.display = "none";
    }
}
window.onload = load_blogs;

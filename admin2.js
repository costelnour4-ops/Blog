let idBlogInEditare = null;
let button=document.getElementById("button");
button.onclick=function(event){
    document.querySelector(".create-blog").style.display="flex";
    event.stopPropagation();
}
window.onclick=function(event){
    if (!document.querySelector(".create-blog").contains(event.target)) {
        document.querySelector(".create-blog").style.display = "none";
    }
}
let title=document.getElementById("title");
let container=document.getElementById("content");
let button_blog=document.getElementById("submit-blog");

button_blog.onclick=function(){
const blog = {
        id:Date.now(),
        Title: title.value,
        Body: container.value,
        date:  new Date().toISOString().split('T')[0]
    };
fetch('http://localhost:3000/add-blog',{
    method:"POST",
    headers:{
        "Content-Type":"application/json"
    },
    body:JSON.stringify(blog)
})
.then(res=>{
    if(res.ok){
        document.querySelectorAll(".create-blog").style.display="none";
        title.value="";
        container.value = "";
        load_blogs();
    }
    else {
        alert("Eroare la adăugarea blogului pe server!");
    }
}) 
.catch(error => console.error("Eroare rețea la adăugare:", error));
}
let last_id;
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
                    <button class="Sterge"> Sterge</button>
                    <button class="Edit">Edit</button>
                    </div>
                    </div>
                    <hr>
                `;
                const deleteButton = blogWrapper.querySelector('.Sterge');

            deleteButton.onclick=function(){
                const id_to_delete=blog.id;
                fetch(`http://localhost:3000/delete_blog/${id_to_delete}`, {
                            method: "DELETE"
                        })
                .then(res=>{
                    if(res.ok) load_blogs();
                    else {
                                alert("Eroare la ștergere!");
                            }
                })
            }
           const editButton = blogWrapper.querySelector('.Edit');

editButton.onclick = function() {
    document.querySelector(".create-blog").style.display="flex";
    event.stopPropagation();
    idBlogInEditare=blog.id;
    document.getElementById("title").value = blog.Title;
    document.getElementById("content").value = blog.Body;
    document.getElementById("submit-blog").innerText = "Salvează Modificările";

};
            lista_bloguri.appendChild(blogWrapper);
        });
      
    })
.catch(error => console.error("A apărut o eroare la descărcare:", error));
}
button_blog.onclick = function() {
    // 1. Colectăm datele NOI scrise de utilizator în căsuțe
    const dateBlog = {
        Title: document.getElementById("title").value,
        Body: document.getElementById("content").value
    };

    let url = 'http://localhost:3000/add-blog';
    
    // 2. Verificăm dacă suntem în modul de editare
    if (idBlogInEditare !== null) {
        url = 'http://localhost:3000/edit-blog'; // Sau http://localhost:3000/edit-blog/${idBlogInEditare} (depinde de serverul tău)
        dateBlog.id = idBlogInEditare; // Îi dăm serverului ID-ul blogului pe care îl modificăm
    } else {
        // Dacă e adăugare nouă, generăm ID și dată
        dateBlog.id = Date.now();
        dateBlog.date = new Date().toISOString().split('T')[0];
    }

    // 3. Trimitem cererea
    fetch(url, {
        method: "POST", // Poți folosi PUT pentru editare dacă serverul tău o cere
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dateBlog) // Trimitem datele noi, completate în formular!
    })
    .then(res => {
        if (res.ok) {
            document.querySelector(".create-blog").style.display = "none";
            document.getElementById("title").value = "";
            document.getElementById("content").value = "";
            
            // RESETĂM STAREA pentru a reveni la modul de adăugare
            idBlogInEditare = null;
            document.getElementById("submit-blog").innerText = "Submit";
            
            load_blogs(); // Reîncărcăm lista
        } else {
            alert("Eroare la salvarea datelor pe server!");
        }
    })
    .catch(error => console.error("Eroare rețea:", error));
};
window.onload = load_blogs;

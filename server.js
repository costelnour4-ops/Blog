const fs=require("fs");
const path=require("path");
const File_name=path.join(__dirname,"Blogs.json");
const express=require("express");
const app=express();
const cors=require("cors");
const Port=3000;
app.use(cors());
app.use(express.json());

app.post("/add-blog",(req,res)=>{
    const newblog=req.body;
    fs.readFile(File_name,'utf-8',(err,data)=>{
    let blogs=[];
        if(err){
            if (err.code !== 'ENOENT') {
                console.error("Eroare gravă la citire:", err);
                // BARIERA DE SIGURANȚĂ: Oprim execuția ca să NU scriem peste fișier
                return res.status(500).json({ error: "Nu s-au putut citi datele vechi." });
            }
        }
           else if (data && data.trim()){ try{
                blogs=JSON.parse(data);

            }catch(error){
                blogs=[];
            }
        }
        
        blogs.push(newblog);
        fs.writeFile(File_name,JSON.stringify(blogs,null,2), 'utf-8',(writeErr)=>{
        if (writeErr) {
                console.error("Eroare la salvare:", writeErr);
                return res.status(500).json({ error: "Nu s-au putut salva datele." });
            }
            res.status(200).json({ message: "Blogul a fost adăugat cu succes!", blog: newblog });
    })
})
    })
app.get("/get-blog",(req,res)=>{
    fs.readFile(File_name,'utf-8',(err,data)=>{
    let blogs=[];
    if(err && err.code === 'ENOENT') return res.status(200).json([])
        else if(err) return res.status(500).json({ error: "Eroare la citirea fișierului." });
           
        if (!data || !data.trim()) {
            return res.status(200).json([]);
        }
            try{
        const blogs=JSON.parse(data);
        res.status(200).json(blogs);
        } catch(parseError){
                res.status(500).json({ error: "Formatul fișierului este corupt." });
        }
    })
    
})
app.delete("/delete_blog/:id",(req,res)=>{
    const id_to_delete=req.params.id;
    
    fs.readFile(File_name,'utf-8',(err,data)=>{
        if (err) {
            if (err.code === 'ENOENT') return res.status(404).json({ error: "Nu există niciun blog salvat." });
            return res.status(500).json({ error: "Eroare la citirea bazei de date." });
        }
        if (!data || !data.trim()) {
            return res.status(404).json({ error: "Nu s-au găsit bloguri de șters." });
        }
    let blogs=[];
            try{
                blogs=JSON.parse(data);
                const updated_blogs=blogs.filter((blog=>String(blog.id) !== String(id_to_delete)));
                if (blogs.length === updated_blogs.length) {
                return res.status(404).json({ error: "Blogul cu acest ID nu a fost găsit." });
            }
            fs.writeFile(File_name,JSON.stringify(updated_blogs,null,2), 'utf-8',(writeErr)=>{
        if (writeErr) {
                console.error("Eroare la salvare:", writeErr);
                return res.status(500).json({ error: "Nu s-au putut salva datele." });
            }
            res.status(200).json({ message: "Blogul a fost sters cu succes!", blog: updated_blogs });
    })
            }catch(error){
               return res.status(500).json({ error: "Formatul fișierului JSON este invalid la ștergere." });
            }
        
    
    })
})
app.post("/edit-blog", (req,res)=>{
    const id_to_edit=req.body.id;
    const new_title=req.body.Title;
    const new_body=req.body.Body;
    const new_Date=req.body.date;
    fs.readFile(File_name,'utf-8',(err,data)=>{
        if (err) {
            if (err.code === 'ENOENT') return res.status(404).json({ error: "Nu există niciun blog salvat." });
            return res.status(500).json({ error: "Eroare la citirea bazei de date." });
        }
        if (!data || !data.trim()) {
            return res.status(404).json({ error: "Nu s-au găsit bloguri de editat." });
        }
    let blogs=[];
            try{
                blogs=JSON.parse(data);
                const blog_to_edit = blogs.find(b => b.id === id_to_edit);
                blog_to_edit.Title=new_title;
                blog_to_edit.Body=new_body;
                blog_to_edit.date=new_Date;
            fs.writeFile(File_name,JSON.stringify(blogs,null,2), 'utf-8',(writeErr)=>{
        if (writeErr) {
                console.error("Eroare la salvare:", writeErr);
                return res.status(500).json({ error: "Nu s-au putut salva datele." });
            }
            res.status(200).json({ message: "Blogul a fost editat cu succes!", blog:blogs });
    })
            }catch(error){
               return res.status(500).json({ error: "Formatul fișierului JSON este invalid la ștergere." });
            }
        
    
    })
})
app.listen(Port,()=>{
    console.log("Serverul merge pe portul 3000");
})


import express from "express"; 

type Libros ={
    id: number,
    titulo : string,
    autor: string,
    año: number,
    disponible: boolean,
}
type Prestamos ={
    id: number,
    libroId: number,
    usuario: string,
    fechaPrestamo: string,
    fechaDevolucion: string | null,
}
let libros = [
  { id: 1, titulo: "Clean Code", autor: "Robert C. Martin", año: 2008, disponible: true },
  { id: 2, titulo: "El Quijote", autor: "Miguel de Cervantes", año: 1605, disponible: true },
  { id: 3, titulo: "Sapiens", autor: "Yuval Noah Harari", año: 2011, disponible: false }

];

let prestamos : Prestamos[] = [
  { id: 1, libroId: 3, usuario: "Ana", fechaPrestamo: "2026-10-01", fechaDevolucion: null }
];

const app = express();

app.use(express.json());

/////////////////////////////// LIBROS ///////////////////////////////


app.get("/libros", (peticion, respuesta) => {
    respuesta.json(libros);
});



app.get("/libros/:id", (peticion, respuesta) => {

    const miidDemiCorazon = Number(peticion.params.id);

    const librosQueBusco = libros.find((x) => x.id === miidDemiCorazon);

    if(!librosQueBusco){
        respuesta.status(404).json({
            message: "No se encontro el libro"
        });
        return;
    }
    respuesta.json(librosQueBusco);


})

app.post("/libros", (peticion, respuesta) => {

    if (!peticion.body){
        respuesta.status(400).json({
            message: "No hay body en la peticion"
        });
        return;
    }

    if (!peticion.body.titulo){
        respuesta.status(400).json({
            message: "No hay titulo en la peticion"
        });
        return;
    }
    
    if (!peticion.body.autor){
        respuesta.status(400).json({
            message: "No hay autor en la peticion"
        });
        return;
    } 
    if (!peticion.body.año){
        respuesta.status(400).json({
            message: "No hay año en la peticion"
        });
        return;
    } 

    const nuevoLibro : Libros = {
        id : Math.random(), 
        titulo : peticion.body.titulo,
        autor : peticion.body.autor,
        año : peticion.body.año,
        disponible : peticion.body.disponible,
    }
    libros.push(nuevoLibro);
    respuesta.status(201).json(nuevoLibro);
}); 


app.put("/libros/:id", (peticion, respuesta) => {
    const id = Number(peticion.params.id);

    const libroActualizar = libros.find((x) => x.id === id);

    if (!libroActualizar){
        respuesta.status(404).json({
            message: "NEsa pelicula no existe asique chungo eliminarla"
        });
        return; 
    }

    if (!peticion.body){
        respuesta.status(400).json({
            message: "No hay body en la peticion"
        });
        return;
    }
    
    if (!peticion.body.titulo || !peticion.body.autor || !peticion.body.año || peticion.body.disponible == null) {
    respuesta.status(400).json({
        message: "Me falta algo"
    });
    return;
}

    const libroActualizado : Libros = {
        id, 
        titulo : peticion.body.titulo,
        autor : peticion.body.autor,
        año : peticion.body.año,
        disponible : peticion.body.disponible,
    }

    libros = libros.map(x => x.id === id?libroActualizado : x);

    respuesta.json({
        message: "La pelicula fue actualizada correctamente",
        newFIlm: libroActualizado
    }) 
});


app.patch("/libros/:id", (peticion, respuesta) => {

    const id = Number(peticion.params.id);

    const libroACambiar = libros.find((x) => x.id === id);

    if (!libroACambiar){
        respuesta.status(404).json({
            message: "El libro no existe asique chungo eliminarla"
        });
        return; 
    }

    if (!peticion.body){
        respuesta.status(400).json({
            message: "No hay body en la peticion"
        });
        return;
    }

    if (!peticion.body.titulo && !peticion.body.autor && !peticion.body.año && peticion.body.disponible == null){
    respuesta.status(400).json({
        message: "Me tienes que pasar algo para actualizar"
    });
    return;
}
    const libroActualizado: Libros = {
    id,
    titulo: peticion.body.titulo ? peticion.body.titulo : libroACambiar.titulo,
    autor: peticion.body.autor ? peticion.body.autor : libroACambiar.autor,
    año: peticion.body.año ? peticion.body.año : libroACambiar.año,
    disponible: peticion.body.disponible != null ? peticion.body.disponible : libroACambiar.disponible
};

    libros = libros.map(x => x.id === id?libroActualizado : x);

    respuesta.json({
        message: "El libro fue actualizado correctamente",
        newbook: libroActualizado
    })
})


app.delete("/libros/:id", (peticion, respuesta) => {
    const id = Number(peticion.params.id); 
    const libroParaEliminar = libros.find((x) => x.id === id);

    if(!libroParaEliminar){
        respuesta.status(404).json({
            message: "No se encontro el libro"
        });
        return; 
    }
        if (!libroParaEliminar.disponible) {
        respuesta.status(409).json({
            error: "No se puede eliminar un libro que esta prestado"
        });
        return;
    }

    const nuevaListaFiltrada = libros.filter((x) => (x.id !== id));

    libros = nuevaListaFiltrada;
    
    respuesta.json({
        message: `El libro con id ${id} fue eliminado`,
    });


});

/////////////////////////////// PRESTAMOS ///////////////////////////////

app.get("/prestamos", (peticion, respuesta) => {
    respuesta.json(prestamos);
});



app.get("/libros/:id/prestamos", (peticion, respuesta) => {

    const mimi = Number(peticion.params.id);

    const librosconPrestamosQueBusco = libros.find((x) => x.id === mimi);

    if(!librosconPrestamosQueBusco){
        respuesta.status(404).json({
            message: "No se encontro el libro"
        });
        return;
    }

    const libroPrestamo = prestamos.filter((x) => x.libroId === mimi);
    respuesta.status(200).json(libroPrestamo);


})

app.post("/libros/:id/prestar", (peticion, respuesta) => {
   const id = Number(peticion.params.id);


   const libro = libros.find((x) => x.id === id);


   if (!libro) {
       respuesta.status(404).json({
           message: "Ese libro no existe"
       });
       return
   }


   if (!peticion.body || !peticion.body.usuario) {
       respuesta.status(400).json({
           message: "Tienes que indicar el usuario"
       });
       return
   }


   if (!libro.disponible) {
       respuesta.status(400).json({
           message: "El libro no estA disponible"
       });
       return
   }

   const nuevoPrestamo: Prestamos = {
       id: Math.random(),
       libroId: id,
       usuario: peticion.body.usuario,
       fechaPrestamo: new Date().toString(),
       fechaDevolucion: null
   };

   prestamos.push(nuevoPrestamo);
   libro.disponible = false;

   respuesta.status(201).json({
       message: "Prestamo registrado correctamente",
       prestamo: nuevoPrestamo
   })
   
});


app.post("/libros/:id/devolver", (peticion, respuesta) => {

    const id = Number(peticion.params.id);

    const libro = libros.find((x) => x.id === id);

    if (!libro) {
        respuesta.status(404).json({
            message: "Ese libro no existe"
        });
        return;
    }

    if (libro.disponible) {
        respuesta.status(409).json({
            message: "El libro no estaa prestado"
        });
        return;
    }

    const prestamo = prestamos.find((x) => x.libroId === id && x.fechaDevolucion === null);

    if (!prestamo) {
        respuesta.status(409).json({
            message: "No se ha encontrado un prestamo activo para ese libro"
        });
        return;
    }

    prestamo.fechaDevolucion = new Date().toString();

    libro.disponible = true;

    respuesta.status(200).json({
        message: "Libro devuelto correctamente",
        prestamo: prestamo
    });

});

/////////////////////////////// ESTADISTICAS ///////////////////////////////


app.get("/estadisticas", (peticion, respuesta) => {

    const totalLibros = libros.length;

    const librosDisponibles = libros.filter((x) => x.disponible === true).length;

    const librosPrestados = libros.filter((x) => x.disponible === false).length;

    const totalPrestamos = prestamos.length;

    const prestamosActivos = prestamos.filter((x) => x.fechaDevolucion === null).length;

    respuesta.status(200).json({
        totalLibros: totalLibros,
        librosDisponibles: librosDisponibles,
        librosPrestados: librosPrestados,
        totalPrestamos: totalPrestamos,
        prestamosActivos: prestamosActivos
    });

});

const PORT = 9898;

app.listen(PORT, () => {
    console.log(`Ey, api funcionando en el puerto ${PORT}`)
})

import React, { useEffect, useState, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { nanoid } from 'nanoid';
import { Dialog, Tooltip } from '@material-ui/core';
import { obtenerProductos } from 'utils/api';
import 'react-toastify/dist/ReactToastify.css';


const Productos = () => {
  const [mostrarTabla, setMostrarTabla] = useState(true);
  const [productos, setProductos] = useState([]);
  const [textoBoton, setTextoBoton] = useState('Crear Nuevo Producto');
  const [colorBoton, setColorBoton] = useState('indigo');
  const [ejecutarConsulta, setEjecutarConsulta] = useState(true);

  useEffect(() => {
    console.log('consulta', ejecutarConsulta);
    if (ejecutarConsulta) {
      obtenerProductos(setProductos, setEjecutarConsulta);
    }
  }, [ejecutarConsulta]);

  useEffect(() => {
    //obtener lista de vehículos desde el backend
    if (mostrarTabla) {
      setEjecutarConsulta(true);
    }
  }, [mostrarTabla]);

  useEffect(() => {
    if (mostrarTabla) {
      setTextoBoton('Crear Nuevo producto');
      setColorBoton('indigo');
    } else {
      setTextoBoton('Mostrar Todos los productos');
      setColorBoton('green');
    }
  }, [mostrarTabla]);
  return (
    <div className='flex h-full w-full flex-col items-center justify-start p-8'>
      <div className='flex flex-col w-full'>
        <h2 className='text-3xl font-extrabold text-gray-900'>
          Página de administración de Productos
        </h2>
        <button
          onClick={() => {
            setMostrarTabla(!mostrarTabla);
          }}
          className={`text-white bg-${colorBoton}-500 p-5 rounded-full m-6 w-28 self-end`}
        >
          {textoBoton}
        </button>
      </div>
      {mostrarTabla ? (
        <TablaProductos listaProductos={productos} setEjecutarConsulta={setEjecutarConsulta} />
      ) : (
        <FormularioCreacionProductos
          setMostrarTabla={setMostrarTabla}
          listaProductos={productos}
          setProductos={setProductos}
        />
      )}
      <ToastContainer position='bottom-center' autoClose={5000} />
    </div>
  );
};

const TablaProductos = ({ listaProductos, setEjecutarConsulta }) => {
  const [busqueda, setBusqueda] = useState('');
  const [productosFiltrados, setProductosFiltrados] = useState(listaProductos);

  useEffect(() => {
    setProductosFiltrados(
      listaProductos.filter((elemento) => {
        return JSON.stringify(elemento).toLowerCase().includes(busqueda.toLowerCase());
      })
    );
  }, [busqueda, listaProductos]);

  return (
    <div className='flex flex-col items-center justify-center w-full'>
      <input value={busqueda} 
      onChange={e=>setBusqueda(e.target.value)} placeholder='buscar' className
      ="border border-gray-700 px-3 py-2 self-start rounded-md focus:outline-none focus:border-indigo-500"/>
      <h2 className='text-2xl font-extrabold text-gray-800'>Todos los Productos</h2>
      <div className='hidden md:flex w-full'>
        <table className='tabla'>
          <thead>
            <tr>
              <th>ID Producto</th>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map((producto) => {
              return (
                <FilaProducto
                  key={nanoid()}
                  producto={producto}
                  setEjecutarConsulta={setEjecutarConsulta}
                />
              );
            })}
          </tbody>
        </table>
      </div>
      <div className='flex flex-col w-full m-2 md:hidden'>
        {productosFiltrados.map((el) => {
          return (
            <div className='bg-gray-400 m-2 shadow-xl flex flex-col p-2 rounded-xl'>
              <span>{el.IDproducto}</span>
              <span>{el.produto}</span>
              <span>{el.cantidad}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const FilaProducto = ({ producto, setEjecutarConsulta }) => {
  const [edit, setEdit] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [infoNuevoProducto, setInfoNuevoProducto] = useState({
    IDproducto: producto.IDproducto,
    producto: producto.producto,
    cantidad: producto.cantidad,
  });

  const actualizarProducto = async () => {
    //enviar la info al backend
    const options = {
      method: 'PATCH',
      url: 'https://vast-waters-45728.herokuapp.com/vehicle/update/',
      headers: { 'Content-Type': 'application/json' },
      data: { ...infoNuevoProducto, id: producto._id },
    };

    await axios
      .request(options)
      .then(function (response) {
        setEdit(false);
        setEjecutarConsulta(true);
      })
      .catch(function (error) {
        toast.error('');
        console.error(error);
      });
  };

  const eliminarProducto = async () => {
    const options = {
      method: 'DELETE',
      url: 'https://vast-waters-45728.herokuapp.com/vehicle/delete/',
      headers: { 'Content-Type': 'application/json' },
      data: { id: producto._id },
    };

    await axios
      .request(options)
      .then(function (response) {
        setEjecutarConsulta(true);
      })
      .catch(function (error) {
        console.error(error);
        toast.error('');
      });
    setOpenDialog(false);
  };

  return (
    <tr>
      {edit ? (
        <>
          <td>
            <input
              className='bg-gray-50 border border-gray-600 p-2 rounded-lg m-2'
              type='text'
              value={infoNuevoProducto.IDproducto}
              onChange={(e) => setInfoNuevoProducto({ ...infoNuevoProducto, IDproducto: e.target.value })}
            />
          </td>
          <td>
           {/* <select className='bg-gray-50 border border-gray-600 p-2 rounded-lg m-2' >
              
              <option type='text' value={infoNuevoProducto.brand}
              onChange={(e) =>
                setInfoNuevoProducto({ ...infoNuevoProducto, brand: e.target.value })}>Toyota </option>
              <option type='text' value={infoNuevoProducto.brand}
              onChange={(e) =>
                setInfoNuevoProducto({ ...infoNuevoProducto, brand: e.target.value })}>Mazda </option>
              <option type='text' value={infoNuevoProducto.brand}
              onChange={(e) =>
                setInfoNuevoProducto({ ...infoNuevoProducto, brand: e.target.value })}>Renault </option>
              <option type='text' value={infoNuevoProducto.brand}
              onChange={(e) =>
                setInfoNuevoProducto({ ...infoNuevoProducto, brand: e.target.value })}>Ford </option>
              <option type='text' value={infoNuevoProducto.brand}
              onChange={(e) =>
                setInfoNuevoProducto({ ...infoNuevoProducto, brand: e.target.value })}>Chevrolet </option>
              </select>*/}
            <input
              className='bg-gray-50 border border-gray-600 p-2 rounded-lg m-2'
              type='text'
              value={infoNuevoProducto.producto}
              onChange={(e) =>
                setInfoNuevoProducto({ ...infoNuevoProducto, producto: e.target.value })
              }
            />
          </td>
          <td>
            <input
              className='bg-gray-50 border border-gray-600 p-2 rounded-lg m-2'
              type='text'
              value={infoNuevoProducto.cantidad}
              onChange={(e) =>
                setInfoNuevoProducto({ ...infoNuevoProducto, cantidad: e.target.value })
              }
            />
          </td>
        </>
      ) : (
        <>
          <td>{producto.IDproducto}</td>
          <td>{producto.producto}</td>
          <td>{producto.cantidad}</td>
        </>
      )}
      <td>
        <div className='flex w-full justify-around'>
          {edit ? (
            <>
              <Tooltip title='Confirmar Edición' arrow>
                <i
                  onClick={() => actualizarProducto()}
                  className='fas fa-check text-green-700 hover:text-green-500'
                />
              </Tooltip>
              <Tooltip title='Cancelar edición' arrow>
                <i
                  onClick={() => setEdit(!edit)}
                  className='fas fa-ban text-yellow-700 hover:text-yellow-500'
                />
              </Tooltip>
            </>
          ) : (
            <>
              <Tooltip title='Editar Vehículo' arrow>
                <i
                  onClick={() => setEdit(!edit)}
                  className='fas fa-pencil-alt text-yellow-700 hover:text-yellow-500'
                />
              </Tooltip>
              <Tooltip title='Eliminar Producto' arrow>
                <i
                  onClick={() => setOpenDialog(true)}
                  className='fas fa-trash text-red-700 hover:text-red-500'
                />
              </Tooltip>
            </>
          )}
        </div>
        <Dialog open={openDialog}>
          <div className='p-8 flex flex-col'>
            <h1 className='text-gray-900 text-2xl font-bold'>
              ¿Está seguro de querer eliminar el producto?
            </h1>
            <div className='flex w-full items-center justify-center my-4'>
              <button
                onClick={() => eliminarProducto()}
                className='mx-2 px-4 py-2 bg-green-500 text-white hover:bg-green-700 rounded-md shadow-md'
              >
                Sí
              </button>
              <button
                onClick={() => setOpenDialog(false)}
                className='mx-2 px-4 py-2 bg-red-500 text-white hover:bg-red-700 rounded-md shadow-md'
              >
                No
              </button>
            </div>
          </div>
        </Dialog>
      </td>
    </tr>
  );
};

const FormularioCreacionProductos = ({ setMostrarTabla, listaProductos, setProductos, setEdit}) => {
  const form = useRef(null);

  const submitForm = async (e) => {
    e.preventDefault();
    const fd = new FormData(form.current);

    const nuevoProducto = {};
    fd.forEach((value, key) => {
      nuevoProducto[key] = value;
    });

    const options = {
      method: 'POST',
      url: 'http://localhost:5000/productos/nuevo/',
      headers: { 'Content-Type': 'application/json' },
      data: { IDproducto: nuevoProducto.IDproducto, producto: nuevoProducto.producto, cantidad: nuevoProducto.cantidad },
    };

    await axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
        toast.success('producto modificado con éxito');
        
      })
      .catch(function (error) {
        console.error(error);
        toast.error('error al adicionar el producto');
      });

    setMostrarTabla(true);
  };

  return (
    <div className='flex flex-col items-center justify-center'>
      <h2 className='text-2xl font-extrabold text-gray-800'>Crear nuevo Producto</h2>
      <form ref={form} onSubmit={submitForm} className='flex flex-col'>
        <label className='flex flex-col' htmlFor='nombre'>
          ID Producto
          <input
            name='IDproducto'
            className='bg-gray-50 border border-gray-600 p-2 rounded-lg m-2'
            type='text'
            required
          />
        </label>
        <label className='flex flex-col' htmlFor='producto'>
          Producto
          <input
            className='bg-gray-50 border border-gray-600 p-2 rounded-lg m-2'
            name='name'
            type='text'
            required
          />
        </label>
        <label className='flex flex-col' htmlFor='cantidad'>
          Cantidad
          <input
            name='descripcion'
            className='bg-gray-50 border border-gray-600 p-2 rounded-lg m-2'
            type='text'
            required
          />
        </label>

        <button
          type='submit'
          className='col-span-2 bg-green-400 p-2 rounded-full shadow-md hover:bg-green-600 text-white'
        >
          Guardar producto
        </button>
      </form>
    </div>
  );
};

export default Productos;

'use client'
import { Line } from 'react-chartjs-2';
import { Chart, LineElement, LinearScale, PointElement, CategoryScale, Legend } from 'chart.js';

Chart.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
);

const Seguimiento = () => {
      const mockData = {
        labels: ['14/02', '15/02', '16/02', '17/02', '18/02', '19/02', '20/02'],
        datasets: [
          {
            label: 'Mapa de dolor',
            data: {'14/02': 1, '15/02': 2, '16/02': 4, '17/02': 4, '18/02': 5, '19/02': 6, '20/02': 7, '21/02': 8, '22/02': 9},
            backgroundColor: 'rgb(204, 10, 52)',
            borderColor: 'rgb(204, 10, 52)',
          },
          {
            label: 'Evolución del peso',
            data: {'14/02': 10, '15/02': 10, '16/02': 9, '17/02': 8, '18/02': 4, '19/02': 6, '20/02': 5, '21/02': 5, '22/02': 3},
            backgroundColor: 'rgb(7, 194, 101)',
            borderColor: 'rgb(7, 194, 101)',
          },
          {
            label: 'Repeticiones',
            data: {'14/02': 2, '18/02': 3, '22/02': 4},
            backgroundColor: 'rgb(7, 35, 194)',
            borderColor: 'rgb(7, 35, 194)',
          }
        ],
      };
  return <section className='flex flex-col justify-center content-center text-center w-full'>
      <h1 className='text-3xl'>Paciente 1</h1>
      <div className='flex flex-row justify-center content-center flex-wrap'>
        <div className='h-[26rem] m-8 w-1/2'>
          <h1 className='text-2xl mb-5 font-bold'>Evolución del dolor</h1>
          <Line options={{responsive: true}} data={mockData} />
        </div>
        <div className='h-[26rem] w-[25rem] m-8 ml-20 w-1/2 text-left flex flex-col justify-center content-center'>
          <div className='mb-5'>
            <h3 className='text-2xl mb-1 font-bold'>Datos del paciente</h3>
            <p>Nombre: Nombre de ejemplo</p>
            <p>Edad: 30</p>
            <p>Género: Masculino</p>
            <p>Última cita: 21-03-25</p>
          </div>
          <div>
            <h3 className='text-2xl mb-1 font-bold'>Ejercicios</h3>
            <div className='h-[7rem] overflow-y-scroll'>
              <div className='flex flex-row justify-between w-[10rem]'>
                <p>Ejericio 1 </p>
                <p className='text-red-600 font-bold'>0%</p>
              </div>
              <div className='flex flex-row justify-between w-[10rem]'>
                <p>Ejericio 2 </p>
                <p className='text-green-600 font-bold'>100%</p>
              </div>
              <div className='flex flex-row justify-between w-[10rem]'>
                <p>Ejericio 3 </p>
                <p className='text-green-600 font-bold'>100%</p>
              </div>
              <div className='flex flex-row justify-between w-[10rem]'>
                <p>Ejericio 4 </p>
                <p className='text-green-600 font-bold'>100%</p>
              </div>
              <div className='flex flex-row justify-between w-[10rem]'>
                <p>Ejericio 5 </p>
                <p className='text-green-600 font-bold'>100%</p>
              </div>
              <div className='flex flex-row justify-between w-[10rem]'>
                <p>Ejericio 6 </p>
                <p className='text-green-600 font-bold'>100%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
}

export default Seguimiento;
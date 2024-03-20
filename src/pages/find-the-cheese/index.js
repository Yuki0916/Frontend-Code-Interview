import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Maze from './maze';

const FindTheCheese = ({ mazeData }) => {
	const [maze, setMaze] = useState(mazeData);
	return (
		<div className='flex bg-amber-100 w-full min-h-screen p-4'>
			<div className='mx-auto p-4 w-full md:max-w-[1000px] bg-white rounded'>
				<div className='flex flex-col items-center'>
					<h1 className='text-4xl text-center font-bold'>Find the cheese</h1>
					<p className='text-lg text-center'>Click &apos;Start&apos; to see how the mouse find the cheese by using DFS!</p>
				</div>
				<div className='grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4'>
					{maze.map((i, k) => (
						<Maze key={k} index={k} data={i} />
					))}
				</div>
			</div>
		</div>
	);
};

export async function getServerSideProps(context) {
	try {
		const apiUrl = process.env.NEXT_PUBLIC_API_URL;
		const response = await axios.get(`${apiUrl}/maze`);
		return {
			props: { mazeData: response.data }
		};
	} catch (error) {
		console.error(error);
		return {
			props: { mazeData: null }
		};
	}
}

export default FindTheCheese;

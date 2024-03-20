import React, { useState } from 'react';
import clsx from 'clsx';
import { FaCheese } from 'react-icons/fa';
import { LuRat } from 'react-icons/lu';

const WALL_TYPE = {
	EMPTY: 'empty',
	WALL: 'wall',
	START: 'start',
	END: 'end',
	PATH: 'path',
	VISITED: 'visited'
};

const BTN_STATUS = {
	START: 'start',
	RESET: 'reset'
};

const Cell = ({ type }) => {
	const elClass = clsx('w-5 h-5 flex justify-center items-center', {
		'bg-green-800': type === WALL_TYPE.WALL,
		'bg-lime-50': type === WALL_TYPE.PATH,
		'bg-amber-200': type === WALL_TYPE.VISITED || type === WALL_TYPE.START
	});

	return (
		<div className={elClass}>
			{type === WALL_TYPE.START && <LuRat />}
			{type === WALL_TYPE.END && <FaCheese className='fill-amber-400 ' />}
		</div>
	);
};

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function animateDFS(maze, setMaze) {
	let rows = maze.length;
	let cols = maze[0].length;
	let visited = Array.from(Array(rows), () => Array(cols).fill(false));
	let tempMaze = JSON.parse(JSON.stringify(maze));

	function updateMaze(x, y, type) {
		if (x >= 0 && x < rows && y >= 0 && y < cols) {
			tempMaze[x][y] = type;
			setMaze(JSON.parse(JSON.stringify(tempMaze)));
		}
	}

	async function dfs(x, y) {
		const isCrossLine = x < 0 || x >= rows || y < 0 || y >= cols;
		if (isCrossLine) return false;

		const isWall = tempMaze[x][y] === WALL_TYPE.WALL;
		const isVisited = visited[x][y];
		const isEnd = tempMaze[x][y] === WALL_TYPE.END;

		if (isWall || isVisited) return false;

		if (isEnd) {
			updateMaze(x, y, WALL_TYPE.START);
			return true;
		}

		updateMaze(x, y, WALL_TYPE.START);
		visited[x][y] = true;

		await sleep(100);
		updateMaze(x, y, WALL_TYPE.VISITED);

		if (await dfs(x - 1, y)) return true;
		if (await dfs(x + 1, y)) return true;
		if (await dfs(x, y - 1)) return true;
		if (await dfs(x, y + 1)) return true;

		updateMaze(x, y, WALL_TYPE.PATH);
		return false;

		// TODO 動畫路線還是以DFS的方式走完後，暫時不知道如何處理倒退路線的動畫
	}

	// 尋找起點並開始DFS
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			if (maze[i][j] === WALL_TYPE.START) {
				dfs(i, j);
			}
		}
	}
}

const Maze = ({ index, data }) => {
	const [maze, setMaze] = useState(data);
	const [btnStatus, setBtnStatus] = useState(BTN_STATUS.START);

	const btnText = {
		[BTN_STATUS.START]: 'Start',
		[BTN_STATUS.RESET]: 'Reset'
	};

	const handleClick = () => {
		if (btnStatus === BTN_STATUS.START) {
			setBtnStatus(BTN_STATUS.RESET);
			animateDFS(maze, setMaze);
		} else {
			setBtnStatus(BTN_STATUS.START);
			setMaze(data);
		}
	};
	return (
		<div className='flex flex-col justify-center items-center gap-4 border-b border-gray-300'>
			<div className='h-[280px] w-[280px] flex flex-col justify-center items-center'>
				{maze.map((row, rowIndex) => (
					<div key={rowIndex} className='flex'>
						{row.map((cell, cellIndex) => (
							<Cell key={cellIndex} type={cell} />
						))}
					</div>
				))}
			</div>
			<button type='button' className='w-full h-[30px] bg-amber-500 rounded mb-4 hover:bg-amber-400' onClick={handleClick}>
				{btnText[btnStatus]}
			</button>
		</div>
	);
};

export default Maze;

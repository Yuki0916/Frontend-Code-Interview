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

function mazeDFS(maze) {
	let rows = maze.length;
	let cols = maze[0].length;
	let resultMaze = JSON.parse(JSON.stringify(maze));

	function dfs(x, y) {
		if (x < 0 || x >= rows || y < 0 || y >= cols) return false; // 檢查是否越界
		if (resultMaze[x][y] === WALL_TYPE.WALL || resultMaze[x][y] === WALL_TYPE.VISITED) return false; // 檢查是否為牆壁或已訪問過

		if (resultMaze[x][y] === WALL_TYPE.END) {
			// 檢查當前單元格是否為終點
			resultMaze[x][y] = WALL_TYPE.START; // 抵達終點後將其改為起點
			return true;
		}

		// 	標記當前單元格為已訪問
		resultMaze[x][y] = WALL_TYPE.VISITED;

		if (dfs(x - 1, y) || dfs(x + 1, y) || dfs(x, y - 1) || dfs(x, y + 1)) {
			// 探索所有可能的方向
			return true;
		}

		// 如果在此路徑中未找到終點，則回溯並將路徑標記回 'path'
		resultMaze[x][y] = WALL_TYPE.PATH;
		return false;
	}

	// 尋找起點並開始DFS
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			if (resultMaze[i][j] === WALL_TYPE.START && dfs(i, j)) {
				return resultMaze;
			}
		}
	}

	// 如果沒有找到路徑
	return resultMaze;
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
			setMaze(mazeDFS(maze));
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

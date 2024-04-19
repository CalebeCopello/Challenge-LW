/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from 'react'
import {
	Alert,
	Button,
	Spinner,
	Table,
	FileInput,
	Tooltip,
} from 'flowbite-react'
import { GrCircleAlert } from 'react-icons/gr'
import { CSVLink } from 'react-csv'
import '../app/globals.css'

const Dashboard = () => {
	const headers = [
		'title',
		'price',
		'description',
		'category',
		'image',
		'rating.rate',
		'rating.count',
	]

	const [loading, setLoading] = useState<boolean>(false)
	const [products, setProducts] = useState<any>([])
	const [productsNumber, setProductsNumber] = useState<number | null>(null)
	const [error, setError] = useState<string | null>(null)

	const [productsDb, setProductsDb] = useState<any>([])

	const [CSVFile, setCSVFile] = useState<boolean>(true)
	const [file, setFile] = useState<File | null>()
	const [dataCSV, setDataCSV] = useState<any>([])
	const [dataCSVAdded, setDataCSVAdded] = useState<any>([])
	const [csvLines, setCsvLines] = useState<number>(0)

	const [csvMessage, setCsvMessage] = useState<string | null>(null)
	const [apiMessage, setApiMessage] = useState<string | null>(null)

	useEffect(() => {
		setProductsDb([])
		const importingProductsDB = async () => {
			const response = await fetch('http://127.0.0.1:8000/api/produto')
			if (!response.ok) {
				throw new Error('Falha ao importar os produtos')
			}
			const data = await response.json()
			setProductsDb(data)
		}
		importingProductsDB()
	}, [loading, dataCSV, products])

	useEffect(() => {
		if (productsNumber || productsNumber === 0) {
			setApiMessage(`Produtos Importados da API: ${productsNumber}`)
		} else {
			setApiMessage(null)
		}
	}, [productsNumber, products])

	useEffect(() => {
		if (dataCSVAdded.length === 0 && csvLines > 0) {
			setCsvMessage(`${csvLines} linhas lidas, Nenhum produto adicionado`)
		} else if (dataCSVAdded.length > 0 && csvLines > 0) {
			setCsvMessage(`${csvLines} linhas lidas, ${dataCSVAdded.length} produto(s) adicionado(s)`)
		} else {
			setCsvMessage(null)
		}
	}, [dataCSVAdded, csvLines])

	//*Importing products
	//**Import products from fakeAPI
	const importProducts = async () => {
		setLoading(true)
		setError(null)
		setProducts([])
		setProductsNumber(0)
		try {
			const response = await fetch('https://fakestoreapi.com/products')
			if (!response.ok) {
				throw new Error('Erro ao importar produtos')
			}
			const data = await response.json()
			for (const product of data) {
				await addProductToDataBase(product)
			}
		} catch (err: any) {
			setLoading(false)
			return setError(err.message)
		}
	}
	//** Adding products to the database
	const addProductToDataBase = async (product: any) => {
		try {
			const response = await fetch('http://127.0.0.1:8000/api/produto', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(product),
			})

			if (!response.ok) {
				throw new Error('Erro ao enviar produto para o backend')
			}
			setProducts((prev: any) => [...prev, product])
			setProductsNumber((prev) => (prev as number) + 1)
		} catch (err: any) {
			console.log(err.message)
		} finally {
			setLoading(false)
		}
	}

	//*Import CSV

	const handleOnChange = (e: any) => {
		if (e.target.files) {
			setFile(e.target.files[0])
			setCSVFile(false)
		}
	}

	const handleOnSubmit = (e: any) => {
		e.preventDefault()
		if (file && typeof window !== 'undefined') {
			const fileReader = new FileReader()

			fileReader.onload = function (e: any) {
				const text = (e.target && e.target.result) as string
				csvFileToDataCSV(text)
			}
			fileReader.readAsText(file)
		}
	}

	const csvFileToDataCSV = async (csvData: String) => {
		setCsvLines(0)
		setLoading(true)
		setError('')
		setDataCSVAdded([])
		const lines = csvData.split('\n')
		// Headers
		const csvHeaders = lines[0].replace(/"/g, '').split(',')
		if (JSON.stringify(csvHeaders) !== JSON.stringify(headers)) {
			setLoading(false)
			return setError('O arquivo não está no formato correto')
		}

		const csvArray = []
		for (let i = 1; i < lines.length; i++) {
			const currentLine = lines[i].split('","')
			const csvObj = {
				title: currentLine[0].replace(/"/g, ''),
				price: currentLine[1].replace(/"/g, ''),
				description: currentLine[2].replace(/"/g, ''),
				category: currentLine[3].replace(/"/g, ''),
				image: currentLine[4].replace(/"/g, ''),
				rating: {
					rate: currentLine[5].replace(/"/g, ''),
					count: currentLine[6].replace(/"/g, ''),
				},
			}
			csvArray.push(csvObj)
		}
		for (const product of csvArray) {
			await csvToDataBase(product)
		}
		setDataCSV(csvArray)
	}

	const csvToDataBase = async (product: any) => {
		setCsvLines((p: number) => p + 1)
		try {
			const response = await fetch('http://127.0.0.1:8000/api/produto', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(product),
			})

			if (!response.ok) {
				throw new Error('Erro ao enviar produto para o backend')
			} else {
				setDataCSVAdded((prev: any) => [...prev, product])
			}
		} catch (err: any) {
			console.log(err.message)
		} finally {
			setLoading(false)
			//NOTE: Reset file input
			// setCSVFile(true)
			// const fileInput = document.getElementById('csvFileInput') as HTMLInputElement;
			// if (fileInput) {
			//     fileInput.value = '';
			// }
		}
	}

	return (
		<>
			<div className='flex flex-col sm:flex-row mx-auto justify-center max-w-screen-2xl mt-5'>
				<div className='flex mt-5 mb-5 w-2/5 place-content-center'>
					<Tooltip
						style='light'
						content='Importar Produtos da API para o Banco de Dados'
					>
						<Button
							onClick={importProducts}
							disabled={loading}
						>
							{loading ? (
								<>
									<Spinner /> Importando
								</>
							) : (
								'Importar Produtos'
							)}
						</Button>
					</Tooltip>
				</div>
				<div className='flex mt-5 mb-5 w-3/5 place-content-center'>
					<form className='flex'>
						<Tooltip
							style='light'
							content='Escolha um arquivo .csv para adicionar no Bando de Dados'
						>
							<FileInput
								id='csvFileInput'
								accept='.csv'
								onChange={handleOnChange}
							/>
						</Tooltip>
						<Tooltip
							style='light'
							content='Adicione o conteúdo do arquivo .csv no Bando de Dados'
						>
							<Button
								className='ml-5'
								onClick={(e: any) => {
									handleOnSubmit(e)
								}}
								disabled={loading || CSVFile}
							>
								{loading ? (
									<>
										<Spinner /> Importando
									</>
								) : (
									'Importar CSV'
								)}
							</Button>
						</Tooltip>
					</form>
					<Tooltip
						style='light'
						content='Fazer backup do Banco de Dados para um arquivo .csv'
					>
						<Button className='ml-10'>
							<CSVLink
								data={productsDb}
								headers={headers}
								filename={'Arquivo.csv'}
								href='#'
							>
								Exportar CSV
							</CSVLink>
						</Button>
					</Tooltip>
				</div>
				<div className='border border-bg0_dm bg-bg1_lm rounded-md p-3'>
					<span className=''>
						O Banco de dados possui {productsDb.length} produto
						{productsDb.length !== 1 && 's'} cadastrado
						{productsDb.length !== 1 && 's'}.
					</span>
				</div>
			</div>
			<div className='mx-auto mt-5 max-w-screen-md'>
				{error && (
					<Alert
						color='failure'
						icon={GrCircleAlert}
						onDismiss={() => setError('')}
					>
						{error}
					</Alert>
				)}
			</div>
			<div className='w-9/12 mx-auto'>
				{/* Table showing the import from API*/}
				<div className='mx-auto mt-5 mb-5 max-w-screen-md'>
					{apiMessage && (
						<Alert
							icon={GrCircleAlert}
							onDismiss={() => setApiMessage(null)}
						>
							{apiMessage}
						</Alert>
					)}
				</div>
				<div className='mx-auto mt-5 mb-5 max-w-screen-md'>
					{csvMessage && (
						<Alert
							icon={GrCircleAlert}
							onDismiss={() => setCsvMessage(null)}
						>
							{csvMessage}
						</Alert>
					)}
				</div>
				{products.length > 0 && (
					<Table hoverable>
						<Table.Head>
							<Table.HeadCell scope='col'>Nome</Table.HeadCell>
							<Table.HeadCell scope='col'>Preço</Table.HeadCell>
							<Table.HeadCell scope='col'>Descrição</Table.HeadCell>
							<Table.HeadCell scope='col'>Categoria</Table.HeadCell>
							<Table.HeadCell scope='col'>Imagem</Table.HeadCell>
						</Table.Head>
						<Table.Body className='divide-y'>
							{products.map((product: any, index: number) => (
								<Table.Row key={index}>
									<Table.Cell scope='row'>{product.title}</Table.Cell>
									<Table.Cell scope='row'>{product.price}</Table.Cell>
									<Table.Cell scope='row'>{product.description}</Table.Cell>
									<Table.Cell scope='row'>{product.category}</Table.Cell>
									<Table.Cell scope='row'>
										<img
											src={product.image}
											alt={product.description}
											width='200px'
											height='200px'
										/>
									</Table.Cell>
								</Table.Row>
							))}
						</Table.Body>
					</Table>
				)}
				{/* End of Table showing the import from API*/}
				{dataCSVAdded.length > 0 && (
					<>
						<Table hoverable>
							<Table.Head>
								<Table.HeadCell scope='col'>Nome</Table.HeadCell>
								<Table.HeadCell scope='col'>Preço</Table.HeadCell>
								<Table.HeadCell scope='col'>Descrição</Table.HeadCell>
								<Table.HeadCell scope='col'>Categoria</Table.HeadCell>
								<Table.HeadCell scope='col'>Imagem</Table.HeadCell>
							</Table.Head>
							<Table.Body className='divide-y'>
								{dataCSVAdded.map((product: any, index: number) => (
									<Table.Row key={index}>
										<Table.Cell scope='row'>{product.title}</Table.Cell>
										<Table.Cell scope='row'>{product.price}</Table.Cell>
										<Table.Cell scope='row'>{product.description}</Table.Cell>
										<Table.Cell scope='row'>{product.category}</Table.Cell>
										<Table.Cell scope='row'>
											<img
												src={product.image}
												alt={product.description}
												width='200px'
												height='200px'
											/>
										</Table.Cell>
									</Table.Row>
								))}
							</Table.Body>
						</Table>
					</>
				)}
			</div>
		</>
	)
}

export default Dashboard

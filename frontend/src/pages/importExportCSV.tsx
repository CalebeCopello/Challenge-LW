import { useState } from 'react'
import { CSVLink } from 'react-csv'
import '../app/globals.css'
import { Button, Table, FileInput } from 'flowbite-react'

type CSVData = {
	[key: string]: string
}

const ImportExportCSV = () => {
	const [file, setFile] = useState<File | null>()
	const [dataCSV, setDataCSV] = useState<CSVData[]>([])

	const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setFile(e.target.files[0])
		}
	}

	const csvFileToDataCSV = (s: String) => {
		const csvHeader = s.slice(0, s.indexOf('\n')).split(',')
		const csvRows = s.slice(s.indexOf('\n') + 1).split('\n')
		const data: { [key: string]: string }[] = csvRows.map((i) => {
			const values = i.split(',')
			const obj = csvHeader.reduce(
				(object: { [key: string]: string }, header, index) => {
					object[header] = values[index]
					return object
				},
				{}
			)
			return obj
		})
		setDataCSV(data)
	}

	const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (file && typeof window !== 'undefined') {
			const fileReader = new FileReader()

			fileReader.onload = function (e: ProgressEvent<FileReader>) {
				const text = (e.target && e.target.result) as string
				csvFileToDataCSV(text)
			}
			fileReader.readAsText(file)
		}
	}

	const headerKeys = Object.keys(Object.assign({}, ...dataCSV))
	console.log(dataCSV, headerKeys)

	return (
		<>
			<div className='flex flex-row mx:auto mt-5 w-screen place-content-center'>
				<form className='flex'>
					<FileInput
						id='csvFileInput'
						accept='.csv'
						onChange={handleOnChange}
					/>
					<Button
						className='ml-5'
						onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
							handleOnSubmit(e)
						}}
					>
						{' '}
						Importar CSV
					</Button>
				</form>
				<Button className='ml-10'>
					<CSVLink
						headers={headerKeys}
						data={dataCSV}
						filename={'Arquivo.csv'}
					>
						Baixar
					</CSVLink>
				</Button>
			</div>
			<div className='w-9/12 mx-auto mt-5'>
				{dataCSV.length > 0 && headerKeys && (
					<Table hoverable>
						<Table.Head>
							{headerKeys.map((key, index) => (
								<Table.HeadCell key={index}>{key}</Table.HeadCell>
							))}
						</Table.Head>

						<Table.Body>
							{dataCSV.map((item, key) => (
								<Table.Row key={key}>
									{Object.values(item).map((val, index) => (
										<Table.Cell key={index}>{val}</Table.Cell>
									))}
								</Table.Row>
							))}
						</Table.Body>
					</Table>
				)}
			</div>
		</>
	)
}

export default ImportExportCSV

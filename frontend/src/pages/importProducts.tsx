import { useState } from 'react'
import { Alert, Button, Spinner, Table } from 'flowbite-react'
import { GrCircleAlert } from 'react-icons/gr'
import '../app/globals.css'

const ImportProducts = () => {
	const [loading, setLoading] = useState(false)
	const [products, setProducts] = useState<any[]>([])
	const [error, setError] = useState<String | null>(null)

	const importProducts = async () => {
		setLoading(true)
		setError(null)
		try {
			const response = await fetch('https://fakestoreapi.com/products')
			if (!response.ok) {
				throw new Error('Erro ao importar produtos')
			}
			const data = await response.json()
			setProducts(data)
		} catch (err: any) {
			setError(err.message)
		} finally {
			setLoading(false)
		}
	}

	return (
		<>
			<div className='flex flex-col'>
				<div className='mt-5 mb-5 mx-auto'>
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
				</div>
				<div className='mx-auto'>
					{error && (
						<Alert
							color='failure'
							icon={GrCircleAlert}
						>
							{error}
						</Alert>
					)}
				</div>
				<div className='w-9/12 mx-auto'>
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
								{products.map((product, index) => (
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
				</div>
			</div>
		</>
	)
}

export default ImportProducts

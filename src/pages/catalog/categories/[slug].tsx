import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router'

interface IProduct {
    id: string;
    title: string;
}

interface CategoryProps {
    products: IProduct[]
}

export default function Product() {
    const router = useRouter();
    
    if (router.isFallback) {
        return <p>Carregando...</p>
    }

    return <h1>{router.query.slug}</h1>
}

export const getStaticPaths: GetStaticPaths = async () => {
    const response = await fetch(`http://localhost:3333/categories`);
    const categories = await response.json();

    const paths = categories.map(category => {
        return {
            params: { slug: category.id }
        }
    })

    return {
        paths,
        fallback: true
    }
} 

export const getStaticProps: GetStaticProps<CategoryProps> = async (context) => {
    const { slug } = context.params;

    const response = await fetch(`http://localhost:3333/products?category_id=${slug}`);
    const products = await response.json();
    
    return {
        props: {
            products
        },
        revalidate: 60
    }
}

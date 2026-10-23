export default async function handler(req, res) {
  // Permite apenas requisições do tipo POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Método não permitido' });
  }

  const { email, password } = req.body;

  // Credenciais protegidas no servidor (carregadas das variáveis de ambiente da Vercel)
  const adminEmailEnv = process.env.ADMIN_EMAIL || 'contato_saladosjogos@protonmail.com';
  const adminPasswordEnv = process.env.ADMIN_PASSWORD || 'ObitoUchiha@2026';

  const normalizedInputEmail = (email || '').trim().toLowerCase();
  const normalizedAdminEmail = adminEmailEnv.trim().toLowerCase();

  if (normalizedInputEmail === normalizedAdminEmail && password === adminPasswordEnv) {
    return res.status(200).json({ 
      success: true, 
      user: { 
        id: '1', 
        name: 'Administrador Sala dos Jogos', 
        email: normalizedAdminEmail, 
        role: 'admin' 
      } 
    });
  }

  return res.status(401).json({ success: false, message: 'Credenciais inválidas.' });
}
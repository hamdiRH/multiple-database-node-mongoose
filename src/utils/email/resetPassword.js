const resetPasswordEmailTemplate = (to, password) => ` <div style="background: rgb(204,204,204); padding:20px">
  <h3>Bonjour</h3>
  <p>
  Suite a votre demande de réinitialiser votre mot passe</p>
  <p><strong>ci-doussous vous trouverez vos nouveau données de connexion:</strong></p>
  <h4>Email: ${to}</h4>
  <h4>Mot de passe: ${password}</h4>
  <p>Bonne journée</p>
</div>`;
export default resetPasswordEmailTemplate;

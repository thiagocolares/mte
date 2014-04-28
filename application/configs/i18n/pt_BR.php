<?php
/**
 * ********************* OBSERVAÇÕES PARA OS PADROES DE MENSAGENS ***********************
 *
 * 1) QUANDO UMA MENSAGEM POSSUIR %value% :
 *    quer dizer que %value% será substituido por uma variável que será passada pela
 *    função Base_Util::getTranslator('XXX', 'YYY') onde YYY sera introduzido no lugar de %value% em XXX
 *    Obs: quando exitir mais de uma variável em uma mensagem devera ser passado um array para a função onde
 *         a key do array seja igual à string a ser substituida na mensagem.
 *         EX:
 *              $translationStrings['XXXXXXXXXX'] = 'O nr %value1% é maior que nr %value2%';
 *
 *              para traduzir esta frase basta fazer: Base_Util::getTranslator('XXXXXXXXXX', array('value1'=>10000, 'value2'=>500))
 *
 * 2) QUANDO UMA MENSAGEM POSSUIR %0%, %1% ... :
 *    Este padrão é utilizado na internacionalização de mensagens do javascript.
 *    Isto significa que %0%, %1%... serão substituidos pelos parametros passados no array da
 *    função getTranslaterJsComVariaveis(str, arrValue)
 *    Obs: no javascript sempre será passado um array mesmo que exista somente uma variável
 *
 */

$translationStrings = array();


//Buttons
//$translationStrings['BTNG000'] = "Salvar";


// Labels
//$translationStrings['LAB000'] = 'Teste label';


// Grids
//$translationStrings['GRD000'] = 'Teste label';


// Abas


//JS - Mensagens Base (intervalo reservado de 000 à 099)
$translationStrings['js']['MSG000'] = "Aguarde...";
$translationStrings['js']['MSG001'] = "Campo obrigatório.";
$translationStrings['js']['MSG002'] = "Senha com menos de 6 caracteres.";
$translationStrings['js']['MSG003'] = "Atenção: O 'Caps Lock' está ativado.";
$translationStrings['js']['MSG004'] = "A data deve ser maior que a data de hoje. Favor corrigir.";
$translationStrings['js']['MSG005'] = "A data não deve ser menor que a data de hoje. Favor corrigir.";
$translationStrings['js']['MSG006'] = "A data deve ser menor que a data de hoje. Favor corrigir.";
$translationStrings['js']['MSG007'] = "A data não deve ser maior que a data de hoje. Favor corrigir.";
$translationStrings['js']['MSG008'] = "Data início maior que data fim. Favor corrigir.";
$translationStrings['js']['MSG009'] = "Data fim menor que data início. Favor corrigir.";
$translationStrings['js']['MSG010'] = "Erro no tipo de validação de data.";
$translationStrings['js']['MSG011'] = "Data inválida.";
$translationStrings['js']['MSG012'] = "Email inválido.";
$translationStrings['js']['MSG013'] = "CPF Inválido.";
$translationStrings['js']['MSG014'] = "CNPJ Inválido.";
$translationStrings['js']['MSG015'] = "O campo deverá ser composto de pelo menos 2 partes.";



// JS - Mensagnes
//$translationStrings['js']["MSG100"] = "";

// PHP - Mensagens das Regras de Negócios
//$translationStrings['MSG000'] = ...

// Erros
//$translationStrings["ERR000"] = ...

// Alertas
//$translationStrings["ALE000"] = ...

// Sucesso
$translationStrings["SUC000"] = "Os dados foram salvos com sucesso!";
$translationStrings["SUC001"] = "Os dados foram excluídos com sucesso!";

// Zend_Form
$translationStrings['isCNPJInvalid']               = $translationStrings['js']['MSG014'];
$translationStrings['isCPFInvalid']                = $translationStrings['js']['MSG013'];
$translationStrings['notAlnum']                    = "'<strong>%value%</strong>' não possui somente letras e números.";
$translationStrings['notInArray']                  = "opção inválida";
$translationStrings['isEmpty']                     = $translationStrings['js']["MSG001"];
$translationStrings['emailAddressInvalid']         = "'<strong>%value%</strong>' não é um endereço de email válido no formato nome@servidor";
$translationStrings['emailAddressInvalidHostname'] = "'<strong>%value%</strong>' não parece ter um dominio válido";
$translationStrings['emailAddressInvalidFormat']   = $translationStrings['emailAddressInvalid'];
$translationStrings['notReady']                    = "Aguarde... Não está pronto!";





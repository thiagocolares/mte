<?php
class Base_Validate_IsCPF extends Zend_Validate_Abstract
{
    const IS_CPF_INVALID = 'isCPFInvalid';

    /**
     * @var array
     */
    protected $_messageTemplates = array(
        self::IS_CPF_INVALID => "Value is not a CPF valid"
    );

    /**
     * Defined by Zend_Validate_Interface
     *
     * Returns true if and only if $value is not an empty value.
     *
     * @param  string $value
     * @return boolean
     */
    public function isValid($value)
    {
        $this->_setValue((string) $value);
        if( !$this->cpfValidate($value) ){
            $this->_error();
            return false;
        }
        return true;
    }


    /**
     * Função que valida o número de cpf.
     * retorna true ou false.
     *
     * @param string $cpf
     * @return boolean
     */
    private function cpfValidate($cpf)
    {
        $nulos = array("12345678909","11111111111","22222222222","33333333333",
                       "44444444444","55555555555","66666666666","77777777777",
                       "88888888888","99999999999","00000000000");

        $cpf = preg_replace ("@[.-]@", "", $cpf);
        $cpf = ereg_replace("[^0-9]", "", $cpf);

        if( strlen($cpf) != 11 || !is_numeric($cpf) ){
            return false;
        }

        if (!(ereg("[0-9]",$cpf))){
            return false;
        }
        if( in_array($cpf, $nulos) ){
            return false;
        }
        $acum=0;
        for($i=0; $i<9; $i++) {
          $acum+= $cpf[$i]*(10-$i);
        }

        $x=$acum % 11;
        $acum = ($x>1) ? (11 - $x) : 0;
        $dv = $acum;
        if ($acum != $cpf[9]){
          return false;
        }
        $acum=0;
        for ($i=0; $i<10; $i++){
          $acum+= $cpf[$i]*(11-$i);
        }

        $x=$acum % 11;
        $acum = ($x > 1) ? (11-$x) : 0;
        $dv .= $acum;
        if ( $acum != $cpf[10]){
          return false;
        }

        return true;
    }
}

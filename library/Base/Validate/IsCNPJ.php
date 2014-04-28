<?php
class Base_Validate_IsCNPJ extends Zend_Validate_Abstract
{
    const IS_CNPJ_INVALID = 'isCNPJInvalid';

    /**
     * @var array
     */
    protected $_messageTemplates = array(
        self::IS_CNPJ_INVALID => "Value is not a CNPJ valid"
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
        if( !$this->cnpjValidate($value) ){
            $this->_error();
            return false;
        }
        return true;
    }


    /**
     * Função que valida o número de cnpj.
     * retorna true ou false.
     *
     * @param string $cnpj
     * @return boolean
     */
    public function cnpjValidate($cnpj)
    {
        $cnpj = preg_replace ("@[./-]@", "", $cnpj);
        if (strlen ($cnpj) <> 14 or !is_numeric ($cnpj)) {
            return false;
        }
        $j = 5;
        $k = 6;
        $soma1 = "";
        $soma2 = "";

        for ($i = 0; $i < 13; $i++) {
            $j = $j == 1 ? 9 : $j;
            $k = $k == 1 ? 9 : $k;
            $soma2 += ($cnpj{$i} * $k);

            if ($i < 12) {
                $soma1 += ($cnpj{$i} * $j);
            }

            $k--;
            $j--;
        }

        $digito1 = $soma1 % 11 < 2 ? 0 : 11 - $soma1 % 11;
        $digito2 = $soma2 % 11 < 2 ? 0 : 11 - $soma2 % 11;
        return (($cnpj{12} == $digito1) and ($cnpj{13} == $digito2));
    }
}

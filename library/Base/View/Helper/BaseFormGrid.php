<?php
require_once 'Zend/View/Helper/FormElement.php';
class Base_View_Helper_BaseFormGrid extends Zend_View_Helper_FormElement
{
    public function baseFormGrid($id, $value, array $attribs = array())
    {
        $xhtml = '<div id="'
                 .$id
                 .'" '
                 .$this->_htmlAttribs($attribs). '></div>';
        return $xhtml;
    }
}

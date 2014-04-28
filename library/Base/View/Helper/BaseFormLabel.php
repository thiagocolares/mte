<?php
/** Zend_View_Helper_FormElement **/
require_once 'Zend/View/Helper/FormElement.php';
class Base_View_Helper_BaseFormLabel extends Zend_View_Helper_FormElement
{
    /**
     * Generates a 'label' element.
     *
     * @param  string $name Label
     * @param  array $attribs Form element attributes (used to determine if disabled)
     * @return string The element XHTML.
     */
    public function baseFormLabel($name, $value, array $attribs = array())
    {
        $info = $this->_getInfo($name, $value, $attribs);
        extract($info); // name, value, attribs, options, listsep, disable, escape

        $xhtml = '<label'
                . $this->_htmlAttribs($attribs)
                . '>' . $value . '</label>';

        return $xhtml;
    }
}

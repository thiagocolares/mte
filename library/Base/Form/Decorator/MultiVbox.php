<?php 
class Base_Form_Decorator_MultiVbox extends Base_Form_Decorator_Box
{
	protected $_class = 'vBox';

    public function render($content)
    {
        $element = $this->getElement();
        if (!$element instanceof Zend_Form_Element) {
            return $content;
        }
        if (null === $element->getView()) {
            return $content;
        }

        $separator = $this->getSeparator();
        $placement = $this->getPlacement();
        $label     = $this->buildLabel();
        $input     = $this->buildInput();
        $errors    = $this->buildErrors();
        $desc      = $this->buildDescription();
		$attr	   = $this->getAttributes();
		
        $output = "<div {$attr}>"
                . $label
                . "<div class=\"multiOptions\">"
                . $input
                . $errors
                . $desc
                . "</div>"
                . "</div>";

        switch ($placement) {
            case (self::PREPEND):
                return $output . $separator . $content;
            case (self::APPEND):
            default:
                return $content . $separator . $output;
        }
    }
}
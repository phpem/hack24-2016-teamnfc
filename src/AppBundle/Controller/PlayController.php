<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;


class PlayController extends Controller
{
    /**
     * @Route("/play")
     */
    public function indexAction()
    {
        return $this->render('play/index.html.twig', array());
    }
}

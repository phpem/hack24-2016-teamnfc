<?php

namespace AppBundle\Controller;

use Pusher;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class EvilController extends Controller
{

    /**
     * @Route("/evil", name="evil_index")
     * @param Request $request
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function index(Request $request)
    {
        return $this->render(':evil:index.html.twig');
    }

    /**
     * @Route("/evil/reverse", name="evil_reverse")
     * @param Request $request
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function reverse(Request $request)
    {
        $pusher = $this->getPusher();

        $pusher->trigger('test_channel', 'reverse-it', ['reverse' => true]);

        return new Response('');
    }
    /**
     * @Route("/evil/random", name="evil_random")
     * @param Request $request
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function random(Request $request)
    {
        $pusher = $this->getPusher();

        $pusher->trigger('test_channel', 'random-position', ['random' => true]);

        return new Response('');
    }

    /**
     * @return Pusher
     */
    protected function getPusher()
    {
        $options = [
            'cluster'   => 'eu',
            'encrypted' => true
        ];
        $pusher = new Pusher(
            $this->getParameter('pusher_app_key'),
            $this->getParameter('pusher_app_secret'),
            $this->getParameter('pusher_app_id'),
            $options
        );

        return $pusher;
    }
}